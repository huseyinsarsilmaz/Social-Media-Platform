package com.hsynsarsilmaz.smp.user_service.exception;

import org.springframework.http.HttpStatus;

import com.hsynsarsilmaz.smp.common.exception.SmpException;

public final class VerificationCodeInvalidException extends SmpException {
    public VerificationCodeInvalidException(String entity, String identifier) {
        super("verification.code.invalid", HttpStatus.BAD_REQUEST, entity, identifier);
    }
}
