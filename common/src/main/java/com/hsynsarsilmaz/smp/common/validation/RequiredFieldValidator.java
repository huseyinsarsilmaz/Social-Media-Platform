package com.hsynsarsilmaz.smp.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

public class RequiredFieldValidator implements ConstraintValidator<RequiredField, Object> {

    private String entityName;
    private String fieldName;

    @Autowired
    private MessageSource messageSource;

    @Override
    public void initialize(RequiredField constraintAnnotation) {
        this.entityName = constraintAnnotation.entityName();
        this.fieldName = constraintAnnotation.fieldName();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            addViolationMessage(context);
            return false;
        }

        if (value instanceof String strValue) {
            if (strValue.trim().isEmpty()) {
                addViolationMessage(context);
                return false;
            }
        }

        return true;
    }

    private void addViolationMessage(ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        String messageTemplate = messageSource.getMessage("fail.required", null, LocaleContextHolder.getLocale());
        String message = String.format(messageTemplate, entityName, fieldName);

        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
    }
}
