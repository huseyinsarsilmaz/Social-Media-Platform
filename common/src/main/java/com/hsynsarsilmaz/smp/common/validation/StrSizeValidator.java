package com.hsynsarsilmaz.smp.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

public class StrSizeValidator implements ConstraintValidator<StrSize, String> {

    private String entityName;
    private String fieldName;
    private int min;
    private int max;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void initialize(StrSize constraintAnnotation) {
        this.entityName = constraintAnnotation.entityName();
        this.fieldName = constraintAnnotation.fieldName();
        this.min = constraintAnnotation.min();
        this.max = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        int length = value.length();

        if (length < min || length > max) {
            context.disableDefaultConstraintViolation();

            String messageTemplate = messageSource.getMessage("fail.size", null, LocaleContextHolder.getLocale());
            String message = String.format(messageTemplate, entityName, fieldName, min, max);

            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
            return false;
        }

        return true;
    }
}
