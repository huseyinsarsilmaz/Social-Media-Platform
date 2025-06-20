package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
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

    @CacheEvict(value = "postsByUser", key = "#userId")
    @Transactional
    public PostSimple addPost(AddPostRequest req, Long userId) {
        Post newPost = postMapper.toEntity(req);
        newPost.setUserId(userId);

        newPost = postRepository.save(newPost);

        return postMapper.toDtoSimple(newPost);
    }

    @Cacheable(value = "postsByUser", key = "#userId")
    public List<PostSimple> getByUserId(Long userId) {
        List<PostSimple> posts = postRepository.findByUserId(userId).stream()
                .map(postMapper::toDtoSimple)
                .collect(Collectors.toList());
        return posts;
    }

}