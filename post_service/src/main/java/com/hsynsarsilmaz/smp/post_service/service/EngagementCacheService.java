package com.hsynsarsilmaz.smp.post_service.service;

public interface EngagementCacheService {

    public void setEngagementCounts(Long postId, int likeCount, int replyCount, int repostCount);

    public int getCount(Long postId, String field);

    public int getLikeCount(Long postId);

    public int getReplyCount(Long postId);

    public int getRepostCount(Long postId);

    public void incrementCount(Long postId, String field);

    public void decrementCount(Long postId, String field);

    public void addUserLike(Long userId, Long postId);

    public void removeUserLike(Long userId, Long postId);

    public boolean isPostLikedByUser(Long userId, Long postId);

    public void addUserRepost(Long userId, Long postId);

    public void removeUserRepost(Long userId, Long postId);

    public boolean isPostRepostedByUser(Long userId, Long postId);

    public void evictEngagement(Long postId);
}