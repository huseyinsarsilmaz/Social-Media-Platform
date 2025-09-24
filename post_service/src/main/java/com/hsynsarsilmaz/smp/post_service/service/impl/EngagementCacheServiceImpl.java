package com.hsynsarsilmaz.smp.post_service.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.post_service.service.EngagementCacheService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EngagementCacheServiceImpl implements EngagementCacheService {

    @Qualifier("redisTemplateForLong")
    private final RedisTemplate<String, Long> redisTemplateForLong;

    private String postKey(Long postId) {
        return "post:" + postId + ":engagement";
    }

    private String userLikesKey(Long userId) {
        return "user:" + userId + ":likes";
    }

    private String userRepostsKey(Long userId) {
        return "user:" + userId + ":reposts";
    }

    public void setEngagementCounts(Long postId, int likeCount, int replyCount, int repostCount) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("likeCount", (long) likeCount);
        counts.put("replyCount", (long) replyCount);
        counts.put("repostCount", (long) repostCount);
        redisTemplateForLong.opsForHash().putAll(postKey(postId), counts);
    }

    public int getCount(Long postId, String field) {
        Object val = redisTemplateForLong.opsForHash().get(postKey(postId), field);
        return val != null ? ((Number) val).intValue() : 0;
    }

    public int getLikeCount(Long postId) {
        return getCount(postId, "likeCount");
    }

    public int getReplyCount(Long postId) {
        return getCount(postId, "replyCount");
    }

    public int getRepostCount(Long postId) {
        return getCount(postId, "repostCount");
    }

    public void incrementCount(Long postId, String field) {
        redisTemplateForLong.opsForHash().increment(postKey(postId), field, 1);
    }

    public void decrementCount(Long postId, String field) {
        redisTemplateForLong.opsForHash().increment(postKey(postId), field, -1);
    }

    public void addUserLike(Long userId, Long postId) {
        redisTemplateForLong.opsForSet().add(userLikesKey(userId), postId);
    }

    public void removeUserLike(Long userId, Long postId) {
        redisTemplateForLong.opsForSet().remove(userLikesKey(userId), postId);
    }

    public boolean isPostLikedByUser(Long userId, Long postId) {
        return Boolean.TRUE.equals(redisTemplateForLong.opsForSet().isMember(userLikesKey(userId), postId));
    }

    public void addUserRepost(Long userId, Long postId) {
        redisTemplateForLong.opsForSet().add(userRepostsKey(userId), postId);
    }

    public void removeUserRepost(Long userId, Long postId) {
        redisTemplateForLong.opsForSet().remove(userRepostsKey(userId), postId);
    }

    public boolean isPostRepostedByUser(Long userId, Long postId) {
        return Boolean.TRUE.equals(redisTemplateForLong.opsForSet().isMember(userRepostsKey(userId), postId));
    }

    public void evictEngagement(Long postId) {
        redisTemplateForLong.delete(postKey(postId));
    }

}
