package com.hsynsarsilmaz.smp.user_service.service;

import com.hsynsarsilmaz.smp.user_service.model.dto.response.FollowingSimple;

public interface FollowingService {
    public FollowingSimple follow(Long myId, Long followingId);
}
