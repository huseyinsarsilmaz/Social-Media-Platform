package com.hsynsarsilmaz.smp.user_service.model.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserSimple implements Serializable {

    private long id;
    private String username;
    private String email;
    private String name;
    private LocalDateTime createdAt;
    private String bio;
    private String profilePicture;
    private String coverPicture;
    private boolean isFollowing;

}