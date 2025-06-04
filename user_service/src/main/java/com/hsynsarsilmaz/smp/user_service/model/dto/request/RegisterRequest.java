package com.hsynsarsilmaz.smp.user_service.model.dto.request;

import com.hsynsarsilmaz.smp.common.validation.Alphabethical;
import com.hsynsarsilmaz.smp.common.validation.PhoneNumber;
import com.hsynsarsilmaz.smp.common.validation.RequiredField;
import com.hsynsarsilmaz.smp.common.validation.StrSize;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @Email(message = "{fail.email.format}")
    @RequiredField(entityName = "User", fieldName = "email")
    private String email;

    @RequiredField(entityName = "User", fieldName = "password")
    @StrSize(entityName = "User", fieldName = "password", min = 8, max = 32)
    private String password;

    @RequiredField(entityName = "User", fieldName = "name")
    @StrSize(entityName = "User", fieldName = "name", min = 2, max = 32)
    @Alphabethical(entityName = "User", fieldName = "name")

    private String name;

    @RequiredField(entityName = "User", fieldName = "surname")
    @StrSize(entityName = "User", fieldName = "surname", min = 2, max = 32)
    @Alphabethical(entityName = "User", fieldName = "surname")
    private String surname;

    @RequiredField(entityName = "User", fieldName = "phone number")
    @PhoneNumber(entityName = "User", fieldName = "phone number")
    private String phoneNumber;

    private String secretCode;

}
