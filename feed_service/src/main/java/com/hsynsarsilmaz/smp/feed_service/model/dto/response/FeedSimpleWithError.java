package com.hsynsarsilmaz.smp.feed_service.model.dto.response;

import java.util.List;

import org.springframework.http.HttpStatus;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class FeedSimpleWithError extends FeedSimple {
    private String message;
    private HttpStatus errorCode;

    public FeedSimpleWithError(List<PostWithUser> content, int page, boolean last) {
        super(content, page, last);
        message = null;
        errorCode = null;
    }

    public FeedSimpleWithError(String message, HttpStatus errorCode) {
        super(null, -1, true);
        this.message = message;
        this.errorCode = errorCode;
    }
}