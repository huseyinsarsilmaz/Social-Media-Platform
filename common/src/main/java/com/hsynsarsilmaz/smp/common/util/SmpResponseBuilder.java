package com.hsynsarsilmaz.smp.common.util;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SmpResponseBuilder {
    private final MessageSource messageSource;

    public <T> ResponseEntity<SmpResponse<T>> success(String entity, String action, T data,
            HttpStatus status) {
        String message = messageSource.getMessage("success.message", new Object[] { entity, action },
                Locale.getDefault());
        SmpResponse<T> response = new SmpResponse<>(true, message, data);
        return new ResponseEntity<>(response, status);
    }

    public <T> ResponseEntity<SmpResponse<T>> fail(String type, String[] args, T data,
            HttpStatus status) {
        String message = messageSource.getMessage("fail." + type, args, Locale.getDefault());
        SmpResponse<T> response = new SmpResponse<>(false, message, data);
        return new ResponseEntity<>(response, status);
    }

    public <T> ResponseEntity<SmpResponse<T>> failStaticMessage(String message, HttpStatus status) {
        SmpResponse<T> response = new SmpResponse<>(false, message, null);
        return new ResponseEntity<>(response, status);
    }

}