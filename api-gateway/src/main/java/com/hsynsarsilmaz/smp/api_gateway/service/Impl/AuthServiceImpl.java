package com.hsynsarsilmaz.smp.api_gateway.service.Impl;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.exception.FeignClientHandledException;
import com.hsynsarsilmaz.smp.api_gateway.feign.UserService;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.LoginRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.api_gateway.security.JwtUtil;
import com.hsynsarsilmaz.smp.api_gateway.service.AuthService;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public String authenticateAndGenerateToken(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        return jwtUtil.generateToken(request.getUsername());
    }

    public ResponseEntity<SmpResponse<UserSimple>> register(RegisterRequest req) {
        try {
            ResponseEntity<SmpResponse<UserSimple>> response = userService.register(req);
            return response;
        } catch (FeignClientHandledException e) {
            @SuppressWarnings("unchecked")
            SmpResponse<UserSimple> response = (SmpResponse<UserSimple>) e.getResponse();
            return new ResponseEntity<SmpResponse<UserSimple>>(response, e.getStatus());

        }
    }

}
