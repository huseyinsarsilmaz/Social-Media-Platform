package com.hsynsarsilmaz.smp.api_gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.LoginRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.LoginResponse;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.api_gateway.service.AuthService;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SmpResponseBuilder responseBuilder;

    @PostMapping("/register")
    public ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<SmpResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        String jwtToken = authService.authenticateAndGenerateToken(request);
        LoginResponse response = new LoginResponse(jwtToken);

        return responseBuilder.success("User", "logged in", response, HttpStatus.OK);
    }

}
