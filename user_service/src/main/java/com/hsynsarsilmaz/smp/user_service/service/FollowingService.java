package com.hsynsarsilmaz.smp.user_service.service;

import org.springframework.data.domain.Page;

import com.hsynsarsilmaz.smp.user_service.model.dto.response.FollowingSimple;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;

public interface FollowingService {
    public FollowingSimple follow(Long myId, Long followingId);

    public Page<UserSimple> getFollowersOfUser(Long userId, int page);
}
