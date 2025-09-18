package com.hsynsarsilmaz.smp.feed_service.feign;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.feed_service.exception.FeignClientHandledException;

import feign.Response;
import feign.codec.ErrorDecoder;

@Component
public class FeignCustomErrorDecoder implements ErrorDecoder {

    private final ObjectMapper objectMapper;

    public FeignCustomErrorDecoder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Exception decode(String methodKey, Response response) {
        try {
            InputStream body = response.body().asInputStream();
            SmpResponse<?> smpResponse = objectMapper.readValue(body, SmpResponse.class);

            return new FeignClientHandledException(HttpStatus.valueOf(response.status()), smpResponse);
        } catch (IOException e) {
            return new RuntimeException("Failed to decode Feign error response", e);
        }
    }
}