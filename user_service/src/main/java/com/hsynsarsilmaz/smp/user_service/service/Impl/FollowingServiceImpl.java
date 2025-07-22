package com.hsynsarsilmaz.smp.user_service.service.Impl;

import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.user_service.exception.ReflexiveFollowException;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.FollowingSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.Following;
import com.hsynsarsilmaz.smp.user_service.model.mapper.FollowingMapper;
import com.hsynsarsilmaz.smp.user_service.repository.FollowingRepository;
import com.hsynsarsilmaz.smp.user_service.service.FollowingService;
import com.hsynsarsilmaz.smp.user_service.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FollowingServiceImpl implements FollowingService {
    private final FollowingRepository followingRepository;
    private final FollowingMapper followingMapper;
    private final UserService userService;

    public FollowingSimple follow(Long myId, Long followingId) {
        if (myId == followingId) {
            throw new ReflexiveFollowException();
        }

        if (followingRepository.existsByFollowerIdAndFollowingId(myId, followingId)) {
            throw new AlreadyExistsException("Following", "Same users");
        }

        Following following = followingMapper.toEntity(
                userService.getEntityById(myId),
                userService.getEntityById(followingId));

        following = followingRepository.save(following);

        return followingMapper.toDto(following);

    }

}
