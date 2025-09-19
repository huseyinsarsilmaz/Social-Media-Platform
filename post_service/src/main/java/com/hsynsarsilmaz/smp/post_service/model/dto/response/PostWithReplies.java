package com.hsynsarsilmaz.smp.post_service.model.dto.response;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostWithReplies {

    private PostSimple parent;
    private PostSimple self;
    private List<PostSimple> children;
}
