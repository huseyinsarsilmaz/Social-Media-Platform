package com.hsynsarsilmaz.smp.post_service.model.dto.request;

import com.hsynsarsilmaz.smp.common.validation.RequiredField;
import com.hsynsarsilmaz.smp.common.validation.StrSize;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class PostManipulationRequest {

    @RequiredField(entityName = "Post", fieldName = "text")
    @StrSize(entityName = "Post", fieldName = "text", min = 1, max = 255)
    private String text;

    @StrSize(entityName = "Post", fieldName = "image", min = 2, max = 255)
    private String image;
}