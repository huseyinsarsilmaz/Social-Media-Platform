package com.hsynsarsilmaz.smp.user_service.model.dto.request;

import com.hsynsarsilmaz.smp.common.validation.RequiredField;
import com.hsynsarsilmaz.smp.common.validation.StrSize;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @Email(message = "{fail.email.format}")
    @RequiredField(entityName = "User", fieldName = "email")
    private String email;

    @RequiredField(entityName = "User", fieldName = "username")
    @StrSize(entityName = "User", fieldName = "username", min = 2, max = 16)
    private String username;

    @RequiredField(entityName = "User", fieldName = "name")
    @StrSize(entityName = "User", fieldName = "name", min = 2, max = 32)
    private String name;

    @RequiredField(entityName = "User", fieldName = "bio")
    @StrSize(entityName = "User", fieldName = "bio", min = 8, max = 255)
    private String bio;

}
