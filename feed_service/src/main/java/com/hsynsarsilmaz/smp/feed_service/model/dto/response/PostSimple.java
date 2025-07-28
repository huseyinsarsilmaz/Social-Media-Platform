package com.hsynsarsilmaz.smp.feed_service.model.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostSimple implements Serializable {

    private long id;
    private String text;
    private String image;
    private Long userId;
    private LocalDateTime createdAt;

}