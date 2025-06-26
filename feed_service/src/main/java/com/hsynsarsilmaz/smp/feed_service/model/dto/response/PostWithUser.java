package com.hsynsarsilmaz.smp.feed_service.model.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostWithUser {
    private UserSimple user;
    private PostSimple post;
}
