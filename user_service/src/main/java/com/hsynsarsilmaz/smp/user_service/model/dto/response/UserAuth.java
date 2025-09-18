package com.hsynsarsilmaz.smp.user_service.model.dto.response;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserAuth implements Serializable {

    private long id;
    private String username;
    private String password;
    private String role;
}