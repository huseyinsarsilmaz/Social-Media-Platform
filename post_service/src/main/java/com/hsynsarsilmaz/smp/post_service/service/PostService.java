package com.hsynsarsilmaz.smp.post_service.service;

import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;

public interface PostService {

    public PostSimple addPost(AddPostRequest req, Long userId);
}
