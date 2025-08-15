package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.post_service.service.EngagementCacheService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EngagementCacheServiceImpl implements EngagementCacheService {

    @Qualifier("redisTemplateForLongList")
    private final RedisTemplate<String, Set<Long>> redisTemplate;

    public Set<Long> getUserLikes(Long userId) {
        Set<Long> likedPosts = redisTemplate.opsForValue().get("user:" + userId + ":likes");
        if (likedPosts == null) {
            likedPosts = new HashSet<>();
            redisTemplate.opsForValue().set("user:" + userId + ":likes", likedPosts);
        }
        return likedPosts;
    }

    public void setLikeCount(Long postId, int count) {
        redisTemplate.opsForValue().set("post:" + postId + ":likecount", Collections.singleton((long) count));
    }

    public int getLikeCount(Long postId) {
        Set<Long> countSet = redisTemplate.opsForValue().get("post:" + postId + ":likecount");
        if (countSet != null && !countSet.isEmpty()) {
            return countSet.iterator().next().intValue();
        }
        return 0;
    }

    public void incrementLikeCount(Long postId) {
        int current = getLikeCount(postId);
        setLikeCount(postId, current + 1);
    }

    public void decrementLikeCount(Long postId) {
        int current = getLikeCount(postId);
        setLikeCount(postId, Math.max(0, current - 1));
    }

    public void addUserLike(Long userId, Long postId) {
        Set<Long> currentLikes = getUserLikes(userId);
        currentLikes.add(postId);
        redisTemplate.opsForValue().set("user:" + userId + ":likes", currentLikes);
    }

    public void removeUserLike(Long userId, Long postId) {
        Set<Long> currentLikes = getUserLikes(userId);
        currentLikes.remove(postId);
        redisTemplate.opsForValue().set("user:" + userId + ":likes", currentLikes);
    }

}
