package com.hsynsarsilmaz.smp.feed_service.model.dto.response;

import java.util.List;

import org.springframework.http.HttpStatus;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostWithUserAndReplies {

    private PostWithUser parent;
    private PostWithUser self;
    private List<PostWithUser> children;
    private String message;
    private HttpStatus errorCode;

    public PostWithUserAndReplies(String message, HttpStatus errorCode) {
        this.message = message;
        this.errorCode = errorCode;
    }

}
