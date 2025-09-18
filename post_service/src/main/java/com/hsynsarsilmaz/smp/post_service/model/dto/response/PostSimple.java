package com.hsynsarsilmaz.smp.post_service.model.dto.response;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.hsynsarsilmaz.smp.post_service.model.entity.Post;

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
    private int likeCount;
    private boolean isLiked;
    private int replyCount;
    private int repostCount;
    private boolean isReposted;
    private Post.Type type;
    private Long parentId;
    private Long repostOfId;
    private Long quoteOfId;
    private boolean deleted;
}