package com.hsynsarsilmaz.smp.post_service.service;

import java.util.List;

public interface FeedCacheService {

    public List<Long> getFeedPage(String key);

    public void setFeedPage(String key, List<Long> postIds);

    public void evictFeedPages(String prefix);

}
