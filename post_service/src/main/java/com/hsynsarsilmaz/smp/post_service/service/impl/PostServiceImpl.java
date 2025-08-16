package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.Comparator;

import java.util.List;
import java.util.Map;
import java.util.Objects;
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
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;
import com.hsynsarsilmaz.smp.post_service.model.entity.PostLike;
import com.hsynsarsilmaz.smp.post_service.model.mapper.PostMapper;
import com.hsynsarsilmaz.smp.post_service.repository.PostLikeCount;
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

    private void isPostLikedByUser(Long postId, Long userId) {
        if (postLikeRepository.findByPostIdAndUserId(postId, userId).isPresent()) {
            throw new AlreadyExistsException("Like of this post", "this user");
        }
    }

    private void isPostRepostedByUser(Long parentId, Long userId) {
        if (postRepository.existsByUserIdAndTypeAndRepostOfId(userId, Post.Type.REPOST, userId)) {
            throw new AlreadyExistsException("Repost of this post", "this user");
        }
    }

    private void isParentRepost(Long parentId) {
        if (getEntityById(parentId).getType() == Post.Type.REPOST) {
            throw new RepostParentException();
        }
    }

    private PostSimple updatePostCache(Post post, long userId) {
        PostSimple postSimple = postMapper.toDtoSimple(post);
        postCacheService.setPost(postSimple);
        feedCacheService.evictFeedPages("feed:global:page:");
        feedCacheService.evictFeedPages("feed:user:" + userId + ":page:");

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

        return updatePostCache(newPost, userId);
    }

    @Transactional
    public PostSimple repost(AddPostRequest req, Long parentId, Long userId) {
        isParentRepost(parentId);
        isPostRepostedByUser(parentId, userId);
        Post newPost = postMapper.toEntity(req);
        newPost.setUserId(userId);
        newPost.setType(Post.Type.REPOST);
        newPost.setRepostOfId(parentId);

        newPost = postRepository.save(newPost);

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

        return updatePostCache(newPost, userId);
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

        postRepository.delete(post);

        return updatePostCache(post, userId);
    }

    private void decoratePosts(List<PostSimple> posts, Set<Long> likedPosts) {
        posts.forEach(dto -> {
            Integer count = engagementCacheService.getLikeCount(dto.getId());
            dto.setLikeCount(count != null ? count : 0);
            dto.setLiked(likedPosts.contains(dto.getId()));
        });
    }

    private Page<PostSimple> emptyFeedCache(long userId, Pageable pageable, String cacheKey) {
        Page<Post> postPage = cacheKey.contains("global")
                ? postRepository.findByTypeNot(Post.Type.REPLY, pageable)
                : postRepository.findByUserIdAndTypeNot(userId, Post.Type.REPLY, pageable);

        Set<Long> postIds = postPage.getContent().stream()
                .map(Post::getId)
                .collect(Collectors.toSet());
        feedCacheService.setFeedPage(cacheKey, postIds);

        Set<Long> likedPostIds = engagementCacheService.getUserLikes(userId);
        List<PostSimple> posts = postPage.stream()
                .map(postMapper::toDtoSimple)
                .toList();

        posts.forEach(postCacheService::setPost);
        decoratePosts(posts, likedPostIds);

        return new PageImpl<>(posts, pageable, postPage.getTotalElements());
    }

    private Page<PostSimple> partialFeedCache(Set<Long> postIds, List<PostSimple> cachedPosts, Set<Long> likedPosts,
            Pageable pageable) {
        List<Long> missingIds = postIds.stream()
                .filter(id -> cachedPosts.stream().noneMatch(p -> p.getId() == id))
                .toList();

        List<Post> missingPosts = postRepository.findAllById(missingIds);

        Map<Long, Integer> likeCounts = postLikeRepository.countByPostIdIn(missingIds).stream()
                .collect(Collectors.toMap(PostLikeCount::getPostId, PostLikeCount::getCount));

        List<PostSimple> missingDtos = missingPosts.stream()
                .map(postMapper::toDtoSimple)
                .peek(dto -> {
                    dto.setLikeCount(likeCounts.getOrDefault(dto.getId(), 0));
                    dto.setLiked(likedPosts.contains(dto.getId()));
                })
                .toList();

        missingDtos.forEach(postCacheService::setPost);

        List<PostSimple> combinedPosts = Stream.concat(cachedPosts.stream(), missingDtos.stream())
                .sorted(Comparator.comparing(PostSimple::getCreatedAt).reversed())
                .toList();

        decoratePosts(combinedPosts, likedPosts);
        return new PageImpl<>(combinedPosts, pageable, combinedPosts.size());
    }

    private Page<PostSimple> fullFeedCache(List<PostSimple> cachedPosts, Set<Long> likedPosts, Pageable pageable) {
        decoratePosts(cachedPosts, likedPosts);
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
                .toList();

        Set<Long> likedPosts = engagementCacheService.getUserLikes(userId);

        if (cachedPosts.size() < postIds.size()) {
            return partialFeedCache(postIds, cachedPosts, likedPosts, pageable);
        } else {
            return fullFeedCache(cachedPosts, likedPosts, pageable);
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
        isPostLikedByUser(postId, userId);

        PostLike newLike = PostLike.builder()
                .postId(postId)
                .userId(userId)
                .build();

        postLikeRepository.save(newLike);

        engagementCacheService.incrementLikeCount(postId);
        engagementCacheService.addUserLike(userId, postId);

        PostSimple postSimple = postCacheService.getPost(postId);
        if (postSimple == null)
            postSimple = postMapper.toDtoSimple(post);
        postSimple.setLikeCount(engagementCacheService.getLikeCount(postId));
        return postSimple;
    }

    @Transactional
    public PostSimple unlike(Long postId, Long userId) {
        Post post = getEntityById(postId);

        PostLike like = getPostLikeEntity(postId, userId);
        postLikeRepository.delete(like);

        engagementCacheService.decrementLikeCount(postId);
        engagementCacheService.removeUserLike(userId, postId);

        PostSimple postSimple = postCacheService.getPost(postId);
        if (postSimple == null)
            postSimple = postMapper.toDtoSimple(post);
        postSimple.setLikeCount(engagementCacheService.getLikeCount(postId));
        return postSimple;
    }

}