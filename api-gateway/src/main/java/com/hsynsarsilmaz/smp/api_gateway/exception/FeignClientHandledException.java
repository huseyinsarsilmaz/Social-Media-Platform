package com.hsynsarsilmaz.smp.api_gateway.exception;

import org.springframework.http.HttpStatus;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

import lombok.Getter;

@Getter
public class FeignClientHandledException extends RuntimeException {
    private final HttpStatus status;
    private final SmpResponse<?> response;

    public FeignClientHandledException(HttpStatus status, SmpResponse<?> response) {
        super("Feign client error: " + status);
        this.status = status;
        this.response = response;
    }

}
