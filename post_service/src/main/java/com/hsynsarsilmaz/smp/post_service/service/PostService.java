package com.hsynsarsilmaz.smp.post_service.service;

import org.springframework.data.domain.Page;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostWithReplies;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

public interface PostService {

    public PostSimple add(AddPostRequest req, Long userId);

    public PostSimple update(UpdatePostRequest req, Long postId, Long userId);

    public PostSimple delete(Long postId, Long userId);

    public void isOwned(Post post, Long userId);

    public Page<PostSimple> getByUserId(Long userId, int page);

    public Page<PostSimple> getGlobalFeed(int page, long userId);

    public PostSimple like(Long postId, Long userId);

    public PostSimple unlike(Long postId, Long userId);

    public PostSimple reply(AddPostRequest req, Long parentId, Long userId);

    public PostSimple repost(Long parentId, Long userId);

    public PostSimple unrepost(Long parentId, Long userId);

    public PostSimple quote(AddPostRequest req, Long parentId, Long userId);

    public PostWithReplies getWithReplies(Long postId);

}
