package com.hsynsarsilmaz.smp.post_service.service;

import java.util.Set;

public interface FeedCacheService {

    public Set<Long> getFeedPage(String key);

    public void setFeedPage(String key, Set<Long> postIds);

    public void evictFeedPages(String prefix);

}
