package com.hsynsarsilmaz.smp.common.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StrSizeValidator.class)
public @interface StrSize {
    String entityName();

    String fieldName();

    int min();

    int max();

    String message() default "{fail.size}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
