package com.hsynsarsilmaz.smp.post_service.model.mapper;

import org.mapstruct.*;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {

    Post toEntity(AddPostRequest req);

    @Named("toDtoSimple")
    PostSimple toDtoSimple(Post post);

}