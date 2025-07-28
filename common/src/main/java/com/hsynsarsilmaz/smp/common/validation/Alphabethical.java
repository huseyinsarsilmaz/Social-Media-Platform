package com.hsynsarsilmaz.smp.common.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AlphabeticalValidator.class)
public @interface Alphabethical {
    String entityName();

    String fieldName();

    String message() default "{fail.characters}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
