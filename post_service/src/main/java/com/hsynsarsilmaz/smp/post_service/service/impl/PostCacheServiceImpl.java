package com.hsynsarsilmaz.smp.post_service.service.impl;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.service.PostCacheService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostCacheServiceImpl implements PostCacheService {

    @Qualifier("redisTemplateForPostSimple")
    private final RedisTemplate<String, PostSimple> redisTemplate;

    public void setPost(PostSimple post) {
        redisTemplate.opsForValue().set("post:" + post.getId(), post);
    }

    public PostSimple getPost(Long postId) {
        return redisTemplate.opsForValue().get("post:" + postId);
    }

    public void evictPost(Long postId) {
        redisTemplate.delete("post:" + postId);
    }
}
