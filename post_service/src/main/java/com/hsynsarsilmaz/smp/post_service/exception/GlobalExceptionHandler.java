package com.hsynsarsilmaz.smp.post_service.exception;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import com.hsynsarsilmaz.smp.common.exception.SmpException;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final SmpResponseBuilder responseBuilder;

    @ExceptionHandler(SmpException.class)
    public ResponseEntity<SmpResponse<String>> handleSmpException(SmpException ex) {
        return responseBuilder.fail(ex.getType(), ex.getArgs(), null, ex.getHttpStatus());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<SmpResponse<String>> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex) {
        return responseBuilder.fail("invalid.method", new String[] { ex.getMethod() }, null,
                HttpStatus.METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<SmpResponse<String>> handleIllegalArgumentException(IllegalArgumentException ex) {
        return responseBuilder.fail("invalid", new String[] { "Request" }, null,
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<SmpResponse<String>> handleIllegalStateException(IllegalStateException ex) {
        return responseBuilder.fail("invalid", new String[] { "State" }, null,
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<SmpResponse<String>> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex) {
        return responseBuilder.fail("invalid", new String[] { "Request" }, null, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<SmpResponse<Map<String, String>>> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            if (error instanceof FieldError fieldError) {
                String fieldName = fieldError.getField();
                String errorMessage = fieldError.getDefaultMessage();
                errors.put(fieldName, errorMessage);
            }
        });

        return responseBuilder.fail("invalid", new String[] { "Request" }, errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<SmpResponse<String>> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex) {
        String name = ex.getName();

        Object valueObj = ex.getValue();
        String value = (valueObj != null) ? valueObj.toString() : "null";

        Class<?> requiredTypeClass = ex.getRequiredType();
        String type = "unknown";
        String validValueList = "";

        if (requiredTypeClass != null) {
            type = requiredTypeClass.getSimpleName();

            if (requiredTypeClass.isEnum()) {
                Object[] constants = requiredTypeClass.getEnumConstants();
                String validValues = Arrays.stream(constants)
                        .map(Object::toString)
                        .collect(Collectors.joining(", "));
                validValueList = "Valid Values: " + validValues;
            }
        }

        return responseBuilder.fail("invalid.type", new String[] { name, type, value, validValueList }, null,
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<SmpResponse<String>> handleGeneralException(Exception ex) {
        log.error("A internal server errror has occured: " + ex.getMessage(), ex);
        return responseBuilder.fail("general", new String[] {}, null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}