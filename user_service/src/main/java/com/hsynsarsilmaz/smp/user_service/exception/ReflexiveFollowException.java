package com.hsynsarsilmaz.smp.user_service.exception;

import org.springframework.http.HttpStatus;

import com.hsynsarsilmaz.smp.common.exception.SmpException;

public final class ReflexiveFollowException extends SmpException {
    public ReflexiveFollowException() {
        super("reflexive.follow", HttpStatus.BAD_REQUEST);
    }
}
