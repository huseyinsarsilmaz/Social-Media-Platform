package com.hsynsarsilmaz.smp.feed_service.service;

import com.hsynsarsilmaz.smp.feed_service.model.dto.response.FeedSimpleWithError;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostWithUserAndReplies;

public interface FeedService {

    public FeedSimpleWithError getFeed(int page, long userId);

    public PostWithUserAndReplies getPostWithReplies(long postId);

}
