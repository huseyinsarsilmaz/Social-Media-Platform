package com.hsynsarsilmaz.smp.user_service.model.mapper;

import org.mapstruct.*;

import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mappings({
            @Mapping(target = "isActive", ignore = true),
            @Mapping(target = "role", ignore = true),
    })
    User toEntity(RegisterRequest req);

    @Named("toDtoSimple")
    UserSimple toDtoSimple(User user);

    @Named("toDtoAuth")
    UserAuth toDtoAuth(User user);
}
