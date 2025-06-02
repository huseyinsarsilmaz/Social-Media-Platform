package com.hsynsarsilmaz.smp.api_gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;
import com.hsynsarsilmaz.smp.api_gateway.model.mapper.UserMapper;
import com.hsynsarsilmaz.smp.api_gateway.service.AuthService;
import com.hsynsarsilmaz.smp.api_gateway.util.SmpResponseBuilder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final SmpResponseBuilder responseBuilder;
    private final UserMapper userMapper;

    public ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody RegisterRequest request) {

        User newUser = authService.register(request);

        return responseBuilder.success("User", "registered", userMapper.toDtoSimple(newUser), HttpStatus.CREATED);
    }

}
