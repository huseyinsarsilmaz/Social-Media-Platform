package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.common.exception.NotFoundException;
import com.hsynsarsilmaz.smp.post_service.exception.PostNotOwnedException;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;
import com.hsynsarsilmaz.smp.post_service.model.entity.PostLike;
import com.hsynsarsilmaz.smp.post_service.model.mapper.PostMapper;
import com.hsynsarsilmaz.smp.post_service.repository.PostLikeRepository;
import com.hsynsarsilmaz.smp.post_service.repository.PostRepository;
import com.hsynsarsilmaz.smp.post_service.service.PostService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostMapper postMapper;
    private final CacheManager cacheManager;

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

    private void evictPagedCache(String cacheName, String keyPrefix) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache == null)
            return;

        for (int page = 0;; page++) {
            boolean evicted = cache.evictIfPresent(keyPrefix + page);
            if (!evicted)
                break;
        }
    }

    private void evictPostsCache(Long userId) {
        evictPagedCache("postsByUser", "user:" + userId + ":page:");
        evictPagedCache("feedPosts", "user:" + userId + ":page:");
    }

    @Transactional
    public PostSimple add(AddPostRequest req, Long userId) {
        Post newPost = postMapper.toEntity(req);
        newPost.setUserId(userId);

        newPost = postRepository.save(newPost);

        evictPostsCache(userId);
        return postMapper.toDtoSimple(newPost);
    }

    @Cacheable(value = "postsByUser", key = "'user:' + #userId + ':page:' + #page")
    public Page<PostSimple> getByUserId(Long userId, int page) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        Page<Post> postPage = postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<Post> posts = postPage.getContent();
        List<Long> postIds = posts.stream().map(Post::getId).toList();

        if (postIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, postPage.getTotalElements());
        }

        List<PostLike> likes = postLikeRepository.findByPostIdIn(postIds);

        Map<Long, Integer> likeCountMap = new HashMap<>();
        Set<Long> likedPostIds = new HashSet<>();

        for (PostLike like : likes) {
            Long pid = like.getPostId();
            likeCountMap.merge(pid, 1, Integer::sum);
            if (like.getUserId().equals(userId)) {
                likedPostIds.add(pid);
            }
        }

        List<PostSimple> dtoList = posts.stream()
                .map(post -> {
                    PostSimple dto = postMapper.toDtoSimple(post);
                    dto.setLikeCount(likeCountMap.getOrDefault(post.getId(), 0));
                    dto.setLiked(likedPostIds.contains(post.getId()));
                    return dto;
                })
                .toList();

        return new PageImpl<>(dtoList, pageable, postPage.getTotalElements());
    }

    public void isOwned(Post post, Long userId) {
        if (post.getUserId() != userId) {
            throw new PostNotOwnedException();
        }

    }

    @Transactional
    public PostSimple update(UpdatePostRequest req, Long postId, Long userId) {
        Post post = getEntityById(postId);
        isOwned(post, userId);

        postMapper.updateEntity(post, req);
        post = postRepository.save(post);

        evictPostsCache(userId);
        return postMapper.toDtoSimple(post);
    }

    @Transactional
    public PostSimple delete(Long postId, Long userId) {
        Post post = getEntityById(postId);
        isOwned(post, userId);

        postRepository.delete(post);

        evictPostsCache(userId);
        return postMapper.toDtoSimple(post);
    }

    @Cacheable(value = "feedPosts", key = "':user:' + #userId + 'page:' + #page")
    public Page<PostSimple> getAll(int page, Long userId) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);

        List<Post> posts = postPage.getContent();
        List<Long> postIds = posts.stream().map(Post::getId).toList();

        if (postIds.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, postPage.getTotalElements());
        }

        List<PostLike> likes = postLikeRepository.findByPostIdIn(postIds);

        Map<Long, Integer> likeCountMap = new HashMap<>();
        Set<Long> likedPostIds = new HashSet<>();

        for (PostLike like : likes) {
            Long pid = like.getPostId();
            likeCountMap.merge(pid, 1, Integer::sum);
            if (like.getUserId().equals(userId)) {
                likedPostIds.add(pid);
            }
        }

        List<PostSimple> dtoList = posts.stream()
                .map(post -> {
                    PostSimple dto = postMapper.toDtoSimple(post);
                    dto.setLikeCount(likeCountMap.getOrDefault(post.getId(), 0));
                    dto.setLiked(likedPostIds.contains(post.getId()));
                    return dto;
                })
                .toList();

        return new PageImpl<>(dtoList, pageable, postPage.getTotalElements());
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

        PostSimple postSimple = postMapper.toDtoSimple(post);
        postSimple.setLikeCount(postLikeRepository.countByPostId(postId));

        evictPostsCache(userId);

        return postSimple;
    }

    @Transactional
    public PostSimple unlike(Long postId, Long userId) {
        Post post = getEntityById(postId);

        PostLike like = getPostLikeEntity(postId, userId);
        postLikeRepository.delete(like);

        PostSimple postSimple = postMapper.toDtoSimple(post);
        postSimple.setLikeCount(postLikeRepository.countByPostId(postId));

        evictPostsCache(userId);

        return postSimple;
    }

}