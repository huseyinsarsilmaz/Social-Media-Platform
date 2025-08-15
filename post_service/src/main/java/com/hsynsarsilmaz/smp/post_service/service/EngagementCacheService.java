package com.hsynsarsilmaz.smp.post_service.service;

import java.util.Set;

public interface EngagementCacheService {
    public int getLikeCount(Long postId);

    public void setLikeCount(Long postId, int count);

    public void incrementLikeCount(Long postId);

    public void decrementLikeCount(Long postId);

    public Set<Long> getUserLikes(Long userId);

    public void addUserLike(Long userId, Long postId);

    public void removeUserLike(Long userId, Long postId);
}
