package com.hsynsarsilmaz.smp.api_gateway.model.dto.request;

import com.hsynsarsilmaz.smp.api_gateway.validation.RequiredField;
import com.hsynsarsilmaz.smp.api_gateway.validation.StrSize;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @RequiredField(entityName = "User", fieldName = "email")
    @Email(message = "{fail.email.format}")
    private String email;

    @RequiredField(entityName = "User", fieldName = "password")
    @StrSize(entityName = "User", fieldName = "password", min = 8, max = 32)
    private String password;
}