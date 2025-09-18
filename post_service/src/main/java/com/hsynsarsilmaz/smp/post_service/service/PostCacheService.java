package com.hsynsarsilmaz.smp.post_service.service;

import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;

public interface PostCacheService {
    public PostSimple getPost(Long postId);

    public void setPost(PostSimple post);

    public void evictPost(Long postId);
}
