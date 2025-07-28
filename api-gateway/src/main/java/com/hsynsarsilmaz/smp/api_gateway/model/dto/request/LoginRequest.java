package com.hsynsarsilmaz.smp.api_gateway.model.dto.request;

import com.hsynsarsilmaz.smp.common.validation.RequiredField;
import com.hsynsarsilmaz.smp.common.validation.StrSize;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    @RequiredField(entityName = "User", fieldName = "username")
    @StrSize(entityName = "User", fieldName = "username", min = 2, max = 16)
    private String username;

    @RequiredField(entityName = "User", fieldName = "password")
    @StrSize(entityName = "User", fieldName = "password", min = 8, max = 32)
    private String password;
}