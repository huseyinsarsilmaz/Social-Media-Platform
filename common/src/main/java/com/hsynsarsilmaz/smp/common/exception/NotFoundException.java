package com.hsynsarsilmaz.smp.common.exception;

import org.springframework.http.HttpStatus;

public final class NotFoundException extends SmpException {
    public NotFoundException(String entity, String identifier) {
        super("not.found", HttpStatus.NOT_FOUND, entity, identifier);
    }
}