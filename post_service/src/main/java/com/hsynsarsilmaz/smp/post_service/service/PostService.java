package com.hsynsarsilmaz.smp.post_service.service;

import java.util.List;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;

public interface PostService {

    public PostSimple addPost(AddPostRequest req, Long userId);

    public List<PostSimple> getByUserId(Long userId);

}
