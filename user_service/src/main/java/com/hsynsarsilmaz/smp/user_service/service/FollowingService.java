package com.hsynsarsilmaz.smp.user_service.service;

import org.springframework.data.domain.Page;

import com.hsynsarsilmaz.smp.user_service.model.dto.response.FollowingSimple;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;

public interface FollowingService {
    public FollowingSimple follow(Long myId, Long followingId);

    public FollowingSimple unfollow(Long myId, Long followingId);

    public Page<UserSimple> getFollowingsOfUser(Long userId, int page);

    public Page<UserSimple> getFollowersOfUser(Long userId, int page);

    public boolean isFollowing(Long myId, Long followingId);

}
