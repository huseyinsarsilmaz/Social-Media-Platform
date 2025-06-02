package com.hsynsarsilmaz.smp.common.validation;

import java.math.BigDecimal;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

public class PositiveNumberValidator implements ConstraintValidator<PositiveNumber, Number> {

    private String entityName;
    private String fieldName;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void initialize(PositiveNumber constraintAnnotation) {
        this.entityName = constraintAnnotation.entityName();
        this.fieldName = constraintAnnotation.fieldName();
    }

    @Override
    public boolean isValid(Number value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        boolean isPositive = false;
        String numberType = "";

        if (value instanceof Integer) {
            isPositive = ((Integer) value) > 0;
            numberType = "integer";
        } else if (value instanceof Long) {
            isPositive = ((Long) value) > 0;
            numberType = "integer";
        } else if (value instanceof Double) {
            isPositive = ((Double) value) > 0;
            numberType = "number";
        } else if (value instanceof Float) {
            isPositive = ((Float) value) > 0;
            numberType = "number";
        } else if (value instanceof BigDecimal) {
            isPositive = ((BigDecimal) value).compareTo(BigDecimal.ZERO) > 0;
            numberType = "number";
        }

        if (!isPositive) {
            context.disableDefaultConstraintViolation();

            String messageTemplate = messageSource.getMessage("fail.positive.number", null,
                    LocaleContextHolder.getLocale());
            String message = String.format(messageTemplate, entityName, fieldName, numberType);

            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
        }

        return isPositive;
    }
}