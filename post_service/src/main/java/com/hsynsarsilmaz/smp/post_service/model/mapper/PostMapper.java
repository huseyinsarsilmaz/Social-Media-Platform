package com.hsynsarsilmaz.smp.post_service.model.mapper;

import org.mapstruct.*;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.PostManipulationRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {
        @Mappings({
                        @Mapping(target = "userId", ignore = true),
                        @Mapping(target = "parentId", ignore = true),
                        @Mapping(target = "quoteOfId", ignore = true),
                        @Mapping(target = "repostOfId", ignore = true),
                        @Mapping(target = "type", ignore = true),
                        @Mapping(target = "deleted", ignore = true),
        })
        Post toEntity(PostManipulationRequest req);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mappings({
                        @Mapping(target = "likeCount", ignore = true),
                        @Mapping(target = "replyCount", ignore = true),
                        @Mapping(target = "repostCount", ignore = true),
                        @Mapping(target = "reposted", ignore = true),
                        @Mapping(target = "liked", ignore = true),
        })
        @Named("toDtoSimple")
        PostSimple toDtoSimple(Post post);

        @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
        @Mappings({
                        @Mapping(target = "id", ignore = true),
                        @Mapping(target = "createdAt", ignore = true),
                        @Mapping(target = "updatedAt", ignore = true),
                        @Mapping(target = "userId", ignore = true),
                        @Mapping(target = "parentId", ignore = true),
                        @Mapping(target = "quoteOfId", ignore = true),
                        @Mapping(target = "repostOfId", ignore = true),
                        @Mapping(target = "type", ignore = true),
                        @Mapping(target = "deleted", ignore = true),


        })
        void updateEntity(@MappingTarget Post post, UpdatePostRequest req);

}