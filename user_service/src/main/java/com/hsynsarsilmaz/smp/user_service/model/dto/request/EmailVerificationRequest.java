package com.hsynsarsilmaz.smp.user_service.model.dto.request;

import com.hsynsarsilmaz.smp.common.validation.RequiredField;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationRequest {

    @RequiredField(entityName = "User", fieldName = "email")
    @Email(message = "{fail.email.format}")
    private String email;
}