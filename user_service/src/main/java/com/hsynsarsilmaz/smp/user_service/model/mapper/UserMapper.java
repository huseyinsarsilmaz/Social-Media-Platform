package com.hsynsarsilmaz.smp.user_service.model.mapper;

import org.mapstruct.*;

import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.UserUpdateRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {

        @Mappings({
                        @Mapping(target = "isActive", ignore = true),
                        @Mapping(target = "role", ignore = true),
                        @Mapping(target = "profilePicture", ignore = true),
                        @Mapping(target = "coverPicture", ignore = true)
        })
        User toEntity(RegisterRequest req);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mappings({
                        @Mapping(target = "isActive", ignore = true),
                        @Mapping(target = "password", ignore = true),
                        @Mapping(target = "role", ignore = true),
                        @Mapping(target = "id", ignore = true),
                        @Mapping(target = "createdAt", ignore = true),
                        @Mapping(target = "updatedAt", ignore = true),
                        @Mapping(target = "profilePicture", ignore = true),
                        @Mapping(target = "coverPicture", ignore = true)

        })
        void updateEntity(@MappingTarget User user, UserUpdateRequest req);

        @Named("toDtoSimple")
        @Mappings({
                        @Mapping(target = "following", ignore = true),
        })
        UserSimple toDtoSimple(User user);

        @Named("toDtoAuth")
        UserAuth toDtoAuth(User user);
}
