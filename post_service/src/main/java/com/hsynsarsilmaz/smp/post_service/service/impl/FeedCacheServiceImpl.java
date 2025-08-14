package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.post_service.service.FeedCacheService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedCacheServiceImpl implements FeedCacheService {
    private final RedisTemplate<String, Long> redisTemplate;
    private static final long FEED_TTL_SECONDS = 60;

    public List<Long> getFeedPage(String key) {
        List<Long> ids = redisTemplate.opsForList().range(key, 0, -1);
        return (ids == null || ids.isEmpty()) ? null : ids;
    }

    public void setFeedPage(String key, List<Long> postIds) {
        redisTemplate.delete(key);
        if (!postIds.isEmpty()) {
            redisTemplate.opsForList().rightPushAll(key, postIds.toArray(new Long[0]));
            redisTemplate.expire(key, FEED_TTL_SECONDS, TimeUnit.SECONDS);
        }
    }

    public void evictFeedPages(String prefix) {
        Set<String> keys = redisTemplate.keys(prefix + "*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
}
