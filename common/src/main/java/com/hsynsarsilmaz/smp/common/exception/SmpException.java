package com.hsynsarsilmaz.smp.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class SmpException extends RuntimeException {
    private final String type;
    private final String[] args;
    private final HttpStatus httpStatus;

    public SmpException(String messageKey, HttpStatus httpStatus, String... args) {
        super(messageKey);
        this.type = messageKey;
        this.args = args;
        this.httpStatus = httpStatus;
    }
}