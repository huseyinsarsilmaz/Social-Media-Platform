package com.hsynsarsilmaz.smp.user_service.model.dto.request;

import com.hsynsarsilmaz.smp.common.validation.PositiveNumber;
import com.hsynsarsilmaz.smp.common.validation.RequiredField;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowRequest {

    @RequiredField(entityName = "Follower", fieldName = "id")
    @PositiveNumber(entityName = "Follower", fieldName = "id")
    private Long followerId;

    @RequiredField(entityName = "Following", fieldName = "id")
    @PositiveNumber(entityName = "Following", fieldName = "id")
    private Long followingId;

}
