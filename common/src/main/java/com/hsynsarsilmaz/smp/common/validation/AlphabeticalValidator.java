package com.hsynsarsilmaz.smp.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import java.util.regex.Pattern;

public class AlphabeticalValidator implements ConstraintValidator<Alphabethical, String> {

    private String entityName;
    private String fieldName;

    @Autowired
    private MessageSource messageSource;

    private static final Pattern ALPHABETICAL_PATTERN = Pattern.compile("^[\\p{L}]+$");

    @Override
    public void initialize(Alphabethical constraintAnnotation) {
        this.entityName = constraintAnnotation.entityName();
        this.fieldName = constraintAnnotation.fieldName();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) {
            return true;
        }

        if (!ALPHABETICAL_PATTERN.matcher(value).matches()) {
            context.disableDefaultConstraintViolation();

            String messageTemplate = messageSource.getMessage("fail.characters", null, LocaleContextHolder.getLocale());
            String message = String.format(messageTemplate, entityName, fieldName, "alphabetical");

            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
            return false;
        }

        return true;
    }
}
