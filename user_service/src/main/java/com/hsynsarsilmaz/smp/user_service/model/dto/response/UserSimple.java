package com.hsynsarsilmaz.smp.user_service.model.dto.response;

import com.hsynsarsilmaz.smp.user_service.model.entity.User;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserSimple {

    private long id;
    private String email;
    private String name;
    private String surname;
    private User.Role role;
    private String password;
}