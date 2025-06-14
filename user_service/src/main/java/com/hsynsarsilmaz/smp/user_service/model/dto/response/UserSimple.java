package com.hsynsarsilmaz.smp.user_service.model.dto.response;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserSimple {

    private long id;
    private String username;
    private String email;
    private String name;
    private LocalDateTime createdAt;
}