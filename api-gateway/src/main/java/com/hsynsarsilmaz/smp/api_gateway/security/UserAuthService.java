package com.hsynsarsilmaz.smp.api_gateway.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.feign.UserService;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAuthService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        SmpResponse<UserAuth> user = userService.getByEmail(email).getBody();
        if (user == null || user.getData() == null) {
            throw new UsernameNotFoundException(email);
        }

        return new CustomUserDetails(user.getData());
    }

}