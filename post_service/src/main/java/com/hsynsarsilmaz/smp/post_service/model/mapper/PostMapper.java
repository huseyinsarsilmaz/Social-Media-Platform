package com.hsynsarsilmaz.smp.post_service.model.mapper;

import org.mapstruct.*;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.PostManipulationRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {

    @Mapping(target = "userId", ignore = true)
    Post toEntity(PostManipulationRequest req);

    @Named("toDtoSimple")
    PostSimple toDtoSimple(Post post);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "createdAt", ignore = true),
            @Mapping(target = "updatedAt", ignore = true),
            @Mapping(target = "userId", ignore = true),
    })
    void updateEntity(@MappingTarget Post post, UpdatePostRequest req);

}