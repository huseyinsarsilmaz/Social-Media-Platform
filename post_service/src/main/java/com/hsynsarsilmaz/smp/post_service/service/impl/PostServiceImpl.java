package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.common.exception.NotFoundException;
import com.hsynsarsilmaz.smp.post_service.exception.PostNotOwnedException;
import com.hsynsarsilmaz.smp.post_service.exception.RepostParentException;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostWithReplies;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;
import com.hsynsarsilmaz.smp.post_service.model.entity.PostLike;
import com.hsynsarsilmaz.smp.post_service.model.mapper.PostMapper;
import com.hsynsarsilmaz.smp.post_service.repository.PostCount;
import com.hsynsarsilmaz.smp.post_service.repository.PostLikeRepository;
import com.hsynsarsilmaz.smp.post_service.repository.PostRepository;
import com.hsynsarsilmaz.smp.post_service.service.EngagementCacheService;
import com.hsynsarsilmaz.smp.post_service.service.FeedCacheService;
import com.hsynsarsilmaz.smp.post_service.service.PostCacheService;
import com.hsynsarsilmaz.smp.post_service.service.PostService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostMapper postMapper;
    private final FeedCacheService feedCacheService;
    private final PostCacheService postCacheService;
    private final EngagementCacheService engagementCacheService;

    private static final int PAGE_SIZE = 10;

    private Post getEntityById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", "id"));
    }

    private PostLike getPostLikeEntity(Long postId, Long userId) {
        return postLikeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new NotFoundException("Post Like", "user and post ids"));
    }

    private void isRepostAlreadyExists(Long parentId, Long userId) {
        if (postRepository.existsByUserIdAndTypeAndRepostOfId(userId, Post.Type.REPOST, userId)) {
            throw new AlreadyExistsException("Repost of this post", "this user");
        }
    }

    private Post getRepostEntity(Long parentId, Long userId) {
        return postRepository.findByUserIdAndTypeAndRepostOfId(userId, Post.Type.REPOST, parentId)
                .orElseThrow(() -> new NotFoundException("There is no repost of tihs post", "by this user"));

    }

    private void isParentRepost(Long parentId) {
        if (getEntityById(parentId).getType() == Post.Type.REPOST) {
            throw new RepostParentException();
        }
    }

    private void deleteRepostIfExists(Long parentId, Long userId) {
        Optional<Post> repost = postRepository.findByUserIdAndTypeAndRepostOfId(userId, Post.Type.REPOST, parentId);
        if (repost.isPresent()) {
            postRepository.delete(repost.get());
        }
    }

    private PostSimple updatePostCache(Post post, long userId) {
        PostSimple postSimple = postMapper.toDtoSimple(post);
        postCacheService.setPost(postSimple);
        feedCacheService.evictFeedPages("feed:global:page:");
        feedCacheService.evictFeedPages("feed:user:" + userId + ":page:");

        postSimple.setLikeCount(engagementCacheService.getLikeCount(post.getId()));
        postSimple.setReplyCount(engagementCacheService.getReplyCount(post.getId()));
        postSimple.setRepostCount(engagementCacheService.getRepostCount(post.getId()));
        postSimple.setLiked(engagementCacheService.isPostLikedByUser(userId, post.getId()));
        postSimple.setReposted(engagementCacheService.isPostRepostedByUser(userId, post.getId()));

        return postSimple;
    }

    private PostSimple EvictPostCache(Post post, long userId) {
        PostSimple postSimple = postMapper.toDtoSimple(post);
        postCacheService.evictPost(postSimple.getId());
        feedCacheService.evictFeedPages("feed:global:page:");
        feedCacheService.evictFeedPages("feed:user:" + userId + ":page:");
        engagementCacheService.evictEngagement(postSimple.getId());

        return postSimple;
    }

    public void isOwned(Post post, Long userId) {
        if (post.getUserId() != userId) {
            throw new PostNotOwnedException();
        }
    }

    @Transactional
    public PostSimple add(AddPostRequest req, Long userId) {
        Post newPost = postMapper.toEntity(req);
        newPost.setUserId(userId);
        newPost.setType(Post.Type.ORIGINAL);

        newPost = postRepository.save(newPost);

        return updatePostCache(newPost, userId);
    }

    @Transactional
    public PostSimple reply(AddPostRequest req, Long parentId, Long userId) {
        isParentRepost(parentId);
        Post newPost = postMapper.toEntity(req);
        newPost.setUserId(userId);
        newPost.setType(Post.Type.REPLY);
        newPost.setParentId(parentId);

        newPost = postRepository.save(newPost);

        engagementCacheService.incrementCount(parentId, "replyCount");
        return updatePostCache(newPost, userId);
    }

    @Transactional
    public PostSimple repost(Long parentId, Long userId) {
        isParentRepost(parentId);
        isRepostAlreadyExists(parentId, userId);
        Post newPost = new Post();
        newPost.setUserId(userId);
        newPost.setType(Post.Type.REPOST);
        newPost.setRepostOfId(parentId);
        newPost = postRepository.save(newPost);

        engagementCacheService.incrementCount(parentId, "repostCount");
        engagementCacheService.addUserRepost(userId, parentId);
        return updatePostCache(newPost, userId);
    }

    @Transactional
    public PostSimple quote(AddPostRequest req, Long parentId, Long userId) {
        isParentRepost(parentId);
        Post newPost = postMapper.toEntity(req);
        newPost.setUserId(userId);
        newPost.setType(Post.Type.QUOTE);
        newPost.setQuoteOfId(parentId);
        newPost = postRepository.save(newPost);

        engagementCacheService.incrementCount(parentId, "repostCount");
        engagementCacheService.addUserRepost(userId, parentId);
        return updatePostCache(newPost, userId);
    }

    @Transactional
    public PostSimple unrepost(Long parentId, Long userId) {
        isParentRepost(parentId);
        Post repost = getRepostEntity(parentId, userId);
        postRepository.delete(repost);

        engagementCacheService.decrementCount(parentId, "repostCount");
        engagementCacheService.removeUserRepost(userId, parentId);
        return EvictPostCache(repost, userId);
    }

    @Transactional
    public PostSimple update(UpdatePostRequest req, Long postId, Long userId) {
        Post post = getEntityById(postId);
        isOwned(post, userId);

        postMapper.updateEntity(post, req);
        post = postRepository.save(post);

        return updatePostCache(post, userId);
    }

    @Transactional
    public PostSimple delete(Long postId, Long userId) {
        Post post = getEntityById(postId);
        isOwned(post, userId);
        deleteRepostIfExists(postId, userId);
        post.setDeleted(true);
        post.setText("This post has been deleted.");

        postRepository.save(post);

        return updatePostCache(post, userId);
    }

    private void decoratePosts(List<PostSimple> posts, long userId) {
        if (posts.isEmpty())
            return;

        List<Long> postIds = posts.stream().map(PostSimple::getId).toList();

        Map<Long, Integer> likeCounts = new HashMap<>();
        List<Long> missingLikes = new ArrayList<>();
        for (Long postId : postIds) {
            int count = engagementCacheService.getLikeCount(postId);
            if (count == 0)
                missingLikes.add(postId);
            likeCounts.put(postId, count);
        }
        if (!missingLikes.isEmpty()) {
            Map<Long, Integer> dbLikes = postLikeRepository.countByPostIdIn(missingLikes).stream()
                    .collect(Collectors.toMap(PostCount::getPostId, PostCount::getCount));
            dbLikes.forEach((postId, count) -> {
                engagementCacheService.setEngagementCounts(postId,
                        count,
                        engagementCacheService.getReplyCount(postId),
                        engagementCacheService.getRepostCount(postId));
                likeCounts.put(postId, count);
            });
        }

        Map<Long, Integer> replyCounts = new HashMap<>();
        List<Long> missingReplies = new ArrayList<>();
        for (Long postId : postIds) {
            int count = engagementCacheService.getReplyCount(postId);
            if (count == 0)
                missingReplies.add(postId);
            replyCounts.put(postId, count);
        }
        if (!missingReplies.isEmpty()) {
            Map<Long, Integer> dbReplies = postRepository.countByParentIdIn(missingReplies).stream()
                    .collect(Collectors.toMap(PostCount::getPostId, PostCount::getCount));
            dbReplies.forEach((postId, count) -> {
                engagementCacheService.setEngagementCounts(postId,
                        engagementCacheService.getLikeCount(postId),
                        count,
                        engagementCacheService.getRepostCount(postId));
                replyCounts.put(postId, count);
            });
        }

        Map<Long, Integer> combinedCounts = new HashMap<>();
        List<Long> missingPosts = new ArrayList<>();

        for (Long postId : postIds) {
            int count = engagementCacheService.getRepostCount(postId);
            if (count == 0) {
                missingPosts.add(postId);
            }
            combinedCounts.put(postId, count);
        }

        if (!missingPosts.isEmpty()) {
            Map<Long, Integer> dbReposts = postRepository.countRepostsByPostIds(missingPosts).stream()
                    .collect(Collectors.toMap(PostCount::getPostId, PostCount::getCount));
            Map<Long, Integer> dbQuotes = postRepository.countQuotesByPostIds(missingPosts).stream()
                    .collect(Collectors.toMap(PostCount::getPostId, PostCount::getCount));

            for (Long postId : missingPosts) {
                int repostCount = dbReposts.getOrDefault(postId, 0);
                int quoteCount = dbQuotes.getOrDefault(postId, 0);
                int totalCount = repostCount + quoteCount;

                engagementCacheService.setEngagementCounts(
                        postId,
                        engagementCacheService.getLikeCount(postId),
                        engagementCacheService.getReplyCount(postId),
                        totalCount);

                combinedCounts.put(postId, totalCount);
            }
        }

        Set<Long> likedPosts = postLikeRepository.findPostIdsByUserIdAndPostIdIn(userId, postIds);
        likedPosts.forEach(postId -> engagementCacheService.addUserLike(userId, postId));

        Set<Long> repostedPosts = postRepository.findRepostedParentIdsByUser(userId, postIds);
        repostedPosts.forEach(postId -> engagementCacheService.addUserRepost(userId, postId));

        for (PostSimple dto : posts) {
            if (dto.isDeleted()) {
                continue;
            }

            long postId = dto.getId();
            dto.setLikeCount(likeCounts.get(postId));
            dto.setReplyCount(replyCounts.get(postId));
            dto.setRepostCount(combinedCounts.get(postId));
            dto.setLiked(likedPosts.contains(postId));
            dto.setReposted(repostedPosts.contains(postId));
        }
    }

    private Page<PostSimple> emptyFeedCache(long userId, Pageable pageable, String cacheKey) {
        Page<Post> postPage = cacheKey.contains("global")
                ? postRepository.findByTypeNot(Post.Type.REPLY, pageable)
                : postRepository.findByUserIdAndTypeNot(userId, Post.Type.REPLY, pageable);

        Set<Long> postIds = postPage.getContent().stream()
                .map(Post::getId)
                .collect(Collectors.toSet());
        feedCacheService.setFeedPage(cacheKey, postIds);

        List<PostSimple> posts = postPage.stream()
                .map(postMapper::toDtoSimple)
                .toList();

        posts.forEach(postCacheService::setPost);

        decoratePosts(posts, userId);

        return new PageImpl<>(posts, pageable, postPage.getTotalElements());
    }

    private Page<PostSimple> partialFeedCache(long userId, Set<Long> postIds, List<PostSimple> cachedPosts,
            Pageable pageable) {
        List<Long> missingIds = postIds.stream()
                .filter(id -> cachedPosts.stream().noneMatch(p -> p.getId() == id))
                .toList();

        List<Post> missingPosts = postRepository.findAllById(missingIds);

        List<PostSimple> missingDtos = missingPosts.stream()
                .map(postMapper::toDtoSimple)
                .toList();

        missingDtos.forEach(postCacheService::setPost);

        List<PostSimple> combinedPosts = Stream.concat(cachedPosts.stream(), missingDtos.stream())
                .sorted(Comparator.comparing(PostSimple::getCreatedAt).reversed())
                .toList();

        decoratePosts(combinedPosts, userId);

        return new PageImpl<>(combinedPosts, pageable, combinedPosts.size());
    }

    private Page<PostSimple> fullFeedCache(long userId, List<PostSimple> cachedPosts, Pageable pageable) {
        decoratePosts(cachedPosts, userId);
        return new PageImpl<>(cachedPosts, pageable, cachedPosts.size());
    }

    private Page<PostSimple> getFeedFromCache(String cacheKey, long userId, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by(Sort.Direction.DESC, "createdAt"));
        Set<Long> postIds = feedCacheService.getFeedPage(cacheKey);

        if (postIds == null) {
            return emptyFeedCache(userId, pageable, cacheKey);
        }

        List<PostSimple> cachedPosts = postIds.stream()
                .map(postCacheService::getPost)
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(PostSimple::getCreatedAt).reversed())
                .toList();

        if (cachedPosts.size() < postIds.size()) {
            return partialFeedCache(userId, postIds, cachedPosts, pageable);
        } else {
            return fullFeedCache(userId, cachedPosts, pageable);
        }
    }

    public Page<PostSimple> getByUserId(Long userId, int page) {
        String cacheKey = "feed:user:" + userId + ":page:" + page;

        return getFeedFromCache(cacheKey, userId, page);

    }

    public Page<PostSimple> getGlobalFeed(int page, long userId) {
        String cacheKey = "feed:global:page:" + page;

        return getFeedFromCache(cacheKey, userId, page);
    }

    @Transactional
    public PostSimple like(Long postId, Long userId) {
        Post post = getEntityById(postId);

        if (engagementCacheService.isPostLikedByUser(userId, postId)) {
            return getUpdatedPostSimple(post);
        }

        PostLike newLike = PostLike.builder()
                .postId(postId)
                .userId(userId)
                .build();
        postLikeRepository.save(newLike);

        engagementCacheService.incrementCount(postId, "likeCount");
        engagementCacheService.addUserLike(userId, postId);

        return getUpdatedPostSimple(post);
    }

    @Transactional
    public PostSimple unlike(Long postId, Long userId) {
        Post post = getEntityById(postId);

        PostLike like = getPostLikeEntity(postId, userId);
        postLikeRepository.delete(like);

        engagementCacheService.decrementCount(postId, "likeCount");
        engagementCacheService.removeUserLike(userId, postId);

        return getUpdatedPostSimple(post);
    }

    private PostSimple getUpdatedPostSimple(Post post) {
        PostSimple postSimple = postCacheService.getPost(post.getId());
        if (postSimple == null) {
            postSimple = postMapper.toDtoSimple(post);
        }

        postSimple.setLikeCount(engagementCacheService.getLikeCount(post.getId()));
        postSimple.setReplyCount(engagementCacheService.getReplyCount(post.getId()));
        postSimple.setRepostCount(engagementCacheService.getRepostCount(post.getId()));

        return postSimple;
    }

    public PostWithReplies getWithReplies(Long postId) {
        PostSimple self = postCacheService.getPost(postId);
        if (self == null) {
            Post post = getEntityById(postId);
            self = postMapper.toDtoSimple(post);
            postCacheService.setPost(self);
        }

        PostSimple parent = null;
        if (self.getParentId() != null) {
            parent = postCacheService.getPost(self.getParentId());
            if (parent == null) {
                Optional<Post> parentEntity = postRepository.findById(self.getParentId());
                if (parentEntity.isPresent()) {
                    parent = postMapper.toDtoSimple(parentEntity.get());
                    postCacheService.setPost(parent);
                }
            }
        }

        List<Long> childIds = postRepository.findIdsByParentId(postId);
        List<PostSimple> children = childIds.stream()
                .map(id -> {
                    PostSimple child = postCacheService.getPost(id);
                    if (child == null) {
                        Post entity = postRepository.findById(id).orElse(null);
                        if (entity != null) {
                            child = postMapper.toDtoSimple(entity);
                            postCacheService.setPost(child);
                        }
                    }
                    return child;
                })
                .filter(Objects::nonNull)
                .toList();

        List<PostSimple> allPosts = new ArrayList<>();
        allPosts.add(self);
        if (parent != null)
            allPosts.add(parent);
        allPosts.addAll(children);
        decoratePosts(allPosts, self.getUserId());

        PostWithReplies dto = new PostWithReplies();
        dto.setSelf(self);
        dto.setParent(parent);
        dto.setChildren(children);

        return dto;
    }

}