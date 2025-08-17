package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.Set;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.post_service.service.FeedCacheService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedCacheServiceImpl implements FeedCacheService {

    @Qualifier("redisTemplateForLongSet")
    private final RedisTemplate<String, Set<Long>> redisTemplate;

    public void setFeedPage(String key, Set<Long> postIds) {
        redisTemplate.opsForValue().set(key, postIds);
    }

    public Set<Long> getFeedPage(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void evictFeedPages(String prefix) {
        Set<String> keys = redisTemplate.keys(prefix + "*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
}

