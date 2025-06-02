package com.hsynsarsilmaz.smp.api_gateway.model.mapper;

import org.mapstruct.*;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mappings({
            @Mapping(target = "isActive", ignore = true),
            @Mapping(target = "role", ignore = true),
    })
    User toEntity(RegisterRequest req);

    @Named("toDtoSimple")
    UserSimple toDtoSimple(User user);
}
