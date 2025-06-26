package com.hsynsarsilmaz.smp.post_service.service.impl;



import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;

import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.exception.NotFoundException;
import com.hsynsarsilmaz.smp.post_service.exception.PostNotOwnedException;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;
import com.hsynsarsilmaz.smp.post_service.model.mapper.PostMapper;
import com.hsynsarsilmaz.smp.post_service.repository.PostRepository;
import com.hsynsarsilmaz.smp.post_service.service.PostService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    private Post getEntityById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post", "id"));
    }

    @CacheEvict(value = "postsByUser", key = "#userId")
    @Transactional
    public PostSimple addPost(AddPostRequest req, Long userId) {
        Post newPost = postMapper.toEntity(req);
        newPost.setUserId(userId);

        newPost = postRepository.save(newPost);

        return postMapper.toDtoSimple(newPost);
    }

    @Cacheable(value = "postsByUser", key = "'user:' + #userId + ':page:' + #page")
    public Page<PostSimple> getByUserId(Long userId, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<Post> postPage = postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return postPage.map(postMapper::toDtoSimple);
    }


    public void isPostOwned(Post post, Long userId) {
        if (post.getUserId() != userId) {
            throw new PostNotOwnedException();
        }

    }

    @CacheEvict(value = "postsByUser", key = "#userId")
    @Transactional
    public PostSimple updatePost(UpdatePostRequest req, Long postId, Long userId) {
        Post post = getEntityById(postId);
        isPostOwned(post, userId);

        postMapper.updateEntity(post, req);
        post = postRepository.save(post);

        return postMapper.toDtoSimple(post);
    }

    @CacheEvict(value = "postsByUser", key = "#userId")
    @Transactional
    public PostSimple deletePost(Long postId, Long userId) {
        Post post = getEntityById(postId);
        isPostOwned(post, userId);

        postRepository.delete(post);

        return postMapper.toDtoSimple(post);
    }

}