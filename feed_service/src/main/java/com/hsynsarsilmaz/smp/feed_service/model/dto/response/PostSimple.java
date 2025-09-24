package com.hsynsarsilmaz.smp.feed_service.model.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PostSimple implements Serializable {

    public enum Type {
        ORIGINAL,
        REPLY,
        REPOST,
        QUOTE
    }

    private long id;
    private String text;
    private String image;
    private Long userId;
    private LocalDateTime createdAt;
    private int likeCount;
    private boolean isLiked;
    private int replyCount;
    private int repostCount;
    private boolean isReposted;
    private Type type;
    private Long parentId;
    private Long repostOfId;
    private Long quoteOfId;
    private boolean deleted;
}