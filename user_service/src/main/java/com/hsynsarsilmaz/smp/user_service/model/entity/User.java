package com.hsynsarsilmaz.smp.user_service.model.entity;

import com.hsynsarsilmaz.smp.common.model.entity.SmpEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "users")
public class User extends SmpEntity {

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String name;

    public enum Role {
        ROLE_USER,
        ROLE_ADMIN
    }

    @Builder.Default
    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = true)
    @Builder.Default
    private String profilePicture = null;

    @Column(nullable = true)
    @Builder.Default
    private String coverPicture = null;

}
