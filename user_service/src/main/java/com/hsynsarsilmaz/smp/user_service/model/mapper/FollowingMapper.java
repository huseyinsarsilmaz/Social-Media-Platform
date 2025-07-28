package com.hsynsarsilmaz.smp.user_service.model.mapper;

import org.mapstruct.*;

import com.hsynsarsilmaz.smp.user_service.model.dto.response.FollowingSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.Following;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface FollowingMapper {

    @Mapping(target = "follower", source = "follower")
    @Mapping(target = "following", source = "following")
    Following toEntity(User follower, User following);

    @Mapping(source = "follower", target = "follower", qualifiedByName = "toDtoSimple")
    @Mapping(source = "following", target = "following", qualifiedByName = "toDtoSimple")
    FollowingSimple toDto(Following following);
}
