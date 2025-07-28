package com.hsynsarsilmaz.smp.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import java.util.regex.Pattern;

public class PhoneNumberValidator implements ConstraintValidator<PhoneNumber, String> {

    private String entityName;
    private String fieldName;

    @Autowired
    private MessageSource messageSource;

    private static final Pattern PHONE_NUMBER_PATTERN = Pattern.compile("^\\+?[1-9]\\d{9,14}$");

    @Override
    public void initialize(PhoneNumber constraintAnnotation) {
        this.entityName = constraintAnnotation.entityName();
        this.fieldName = constraintAnnotation.fieldName();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        if (!PHONE_NUMBER_PATTERN.matcher(value).matches()) {
            context.disableDefaultConstraintViolation();

            String messageTemplate = messageSource.getMessage("fail.phone.number", null,
                    LocaleContextHolder.getLocale());
            String message = String.format(messageTemplate, entityName, fieldName);

            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
            return false;
        }

        return true;
    }
}
