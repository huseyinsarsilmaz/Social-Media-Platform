package com.hsynsarsilmaz.smp.api_gateway.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.feign.UserService;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAuthService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserSimple user = userService.getByEmail(email).getData();

        return new CustomUserDetails(user);
    }

}