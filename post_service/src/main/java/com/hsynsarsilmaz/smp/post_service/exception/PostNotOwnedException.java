package com.hsynsarsilmaz.smp.post_service.exception;

import org.springframework.http.HttpStatus;

import com.hsynsarsilmaz.smp.common.exception.SmpException;

public final class PostNotOwnedException extends SmpException {
    public PostNotOwnedException() {
        super("post.not.owned", HttpStatus.FORBIDDEN);
    }
}