package com.hsynsarsilmaz.smp.feed_service.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostWithUser {
    private UserSimple user;
    private PostSimple post;
}
