package com.hsynsarsilmaz.smp.feed_service.service;

import com.hsynsarsilmaz.smp.feed_service.model.dto.response.FeedSimpleWithError;

public interface FeedService {

    public FeedSimpleWithError getFeed(int page);
}
