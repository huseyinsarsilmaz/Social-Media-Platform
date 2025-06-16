package com.hsynsarsilmaz.smp.post_service.model.entity;

import com.hsynsarsilmaz.smp.common.model.entity.SmpEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "posts")
public class Post extends SmpEntity {

    @Column(nullable = false)
    private String text;

    @Builder.Default
    @Column(nullable = true)
    private String image = null;

    @Column(nullable = false)
    private Long userId;
}