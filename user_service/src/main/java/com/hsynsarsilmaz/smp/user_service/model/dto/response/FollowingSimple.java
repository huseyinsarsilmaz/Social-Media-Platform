package com.hsynsarsilmaz.smp.user_service.model.dto.response;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FollowingSimple implements Serializable {

    private UserSimple follower;
    private UserSimple following;
}
