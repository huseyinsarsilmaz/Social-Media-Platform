package com.hsynsarsilmaz.smp.post_service.service;

import org.springframework.data.domain.Page;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

public interface PostService {

    public PostSimple addPost(AddPostRequest req, Long userId);

    public PostSimple updatePost(UpdatePostRequest req, Long postId, Long userId);

    public PostSimple deletePost(Long postId, Long userId);

    public void isPostOwned(Post post, Long userId);

    public Page<PostSimple> getByUserId(Long userId, int page);

    public Page<PostSimple> getAll(int page);

}
