package com.hsynsarsilmaz.smp.api_gateway.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserAuth;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final Long id;
    private final List<GrantedAuthority> authorities;

    public CustomUserDetails(UserAuth user) {
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.id = user.getId();
        this.authorities = List.of(new SimpleGrantedAuthority(user.getRole()));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public Long getId() {
        return id;
    }

}