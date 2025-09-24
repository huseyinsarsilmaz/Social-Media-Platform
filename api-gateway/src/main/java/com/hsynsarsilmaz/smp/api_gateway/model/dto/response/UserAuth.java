package com.hsynsarsilmaz.smp.api_gateway.model.dto.response;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserAuth {

    private long id;
    private String username;
    private String role;
    private String password;
}