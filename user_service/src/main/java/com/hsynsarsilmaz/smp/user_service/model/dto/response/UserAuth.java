package com.hsynsarsilmaz.smp.user_service.model.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserAuth {

    private long id;
    private String email;
    private String role;
    private String password;
}