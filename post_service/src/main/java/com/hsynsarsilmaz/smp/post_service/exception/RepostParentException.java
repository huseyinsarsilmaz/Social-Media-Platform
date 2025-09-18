package com.hsynsarsilmaz.smp.post_service.exception;

import org.springframework.http.HttpStatus;

import com.hsynsarsilmaz.smp.common.exception.SmpException;

public final class RepostParentException extends SmpException {
    public RepostParentException() {
        super("parent.repost", HttpStatus.FORBIDDEN);
    }
}