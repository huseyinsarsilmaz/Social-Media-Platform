package com.hsynsarsilmaz.smp.feed_service.model.dto.response;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedSimple implements Serializable {

    private List<PostWithUser> content;
    private int page;
    private boolean last;

}