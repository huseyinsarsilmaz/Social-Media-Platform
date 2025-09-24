package com.hsynsarsilmaz.smp.common.exception;

import org.springframework.http.HttpStatus;

public final class AlreadyExistsException extends SmpException {
    public AlreadyExistsException(String entity, String identifier) {
        super("already.exists", HttpStatus.CONFLICT, entity, identifier);
    }
}
