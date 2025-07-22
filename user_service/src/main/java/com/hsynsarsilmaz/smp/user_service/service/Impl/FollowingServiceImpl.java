package com.hsynsarsilmaz.smp.user_service.service.Impl;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.user_service.exception.ReflexiveFollowException;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.FollowingSimple;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.Following;
import com.hsynsarsilmaz.smp.user_service.model.mapper.FollowingMapper;
import com.hsynsarsilmaz.smp.user_service.model.mapper.UserMapper;
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
    private final UserMapper userMapper;

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

    @Cacheable(value = "userFollowers", key = "':user:' + #userId + ':page:' + #page")
    public Page<UserSimple> getFollowersOfUser(Long userId, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<Following> followings = followingRepository.findByFollowerId(userId, pageable);

        return followings.map(f -> {
            return userMapper.toDtoSimple(f.getFollowing());
        });
    }

}
