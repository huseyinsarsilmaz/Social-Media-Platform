package com.hsynsarsilmaz.smp.api_gateway.security;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.exception.FeignClientHandledException;
import com.hsynsarsilmaz.smp.api_gateway.feign.UserService;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserAuthService implements UserDetailsService {

    private final UserService userService;

    @Override
    @Cacheable(value = "userAuth", key = "#username")
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        try {
            SmpResponse<UserAuth> user = userService.getByUsername(username).getBody();
            if (user == null || user.getData() == null) {
                throw new UsernameNotFoundException("User not found with username: " + username);
            }

            return new CustomUserDetails(user.getData());

        } catch (FeignClientHandledException e) {
            throw new UsernameNotFoundException("User not found: " + username);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error during authentication", e);
        }
    }

}