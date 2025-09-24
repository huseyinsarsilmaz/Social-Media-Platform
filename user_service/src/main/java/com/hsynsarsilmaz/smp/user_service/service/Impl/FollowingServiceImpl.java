package com.hsynsarsilmaz.smp.user_service.service.Impl;

import org.springframework.cache.CacheManager;
import org.springframework.cache.Cache;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.common.exception.NotFoundException;
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
    private final CacheManager cacheManager;

    private void evictFollowCache(Long userId, String cacheValue) {
        Cache cache = cacheManager.getCache(cacheValue);
        String key = ":user:" + userId + ":page:";
        if (cache != null) {
            for (int page = 0;; page++) {
                if (!cache.evictIfPresent(key + page)) {
                    break;
                }
            }
        }
    }

    private void evictFollowingUserCache(Long followingId) {
        String followingUsername = userService.getEntityById(followingId).getUsername();

        Cache cache = cacheManager.getCache("userSimple");
        if (cache != null) {
            cache.evictIfPresent(followingUsername);
        }

    }

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

        evictFollowCache(followingId, "userFollowers");
        evictFollowCache(myId, "userFollowings");
        evictFollowingUserCache(followingId);

        return followingMapper.toDto(following);
    }

    public FollowingSimple unfollow(Long myId, Long followingId) {
        if (myId == followingId) {
            throw new ReflexiveFollowException();
        }

        Following following = followingRepository.findByFollowerIdAndFollowingId(myId, followingId)
                .orElseThrow(() -> new NotFoundException("Following", "these users"));

        followingRepository.delete(following);

        evictFollowCache(followingId, "userFollowers");
        evictFollowCache(myId, "userFollowings");
        evictFollowingUserCache(followingId);

        return followingMapper.toDto(following);
    }

    @Cacheable(value = "userFollowings", key = "':user:' + #userId + ':page:' + #page")
    public Page<UserSimple> getFollowingsOfUser(Long userId, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<Following> followings = followingRepository.findByFollowerId(userId, pageable);

        return followings.map(f -> {
            return userMapper.toDtoSimple(f.getFollowing());
        });
    }

    @Cacheable(value = "userFollowers", key = "':user:' + #userId + ':page:' + #page")
    public Page<UserSimple> getFollowersOfUser(Long userId, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        Page<Following> followers = followingRepository.findByFollowingId(userId, pageable);

        return followers.map(f -> {
            return userMapper.toDtoSimple(f.getFollower());
        });
    }

    public boolean isFollowing(Long myId, Long followingId) {
        return followingRepository.existsByFollowerIdAndFollowingId(myId, followingId);
    }

}
