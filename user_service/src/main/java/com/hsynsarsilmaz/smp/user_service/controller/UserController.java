package com.hsynsarsilmaz.smp.user_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;
import com.hsynsarsilmaz.smp.user_service.model.mapper.UserMapper;
import com.hsynsarsilmaz.smp.user_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final SmpResponseBuilder responseBuilder;

    @PostMapping("/register")
    public ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody RegisterRequest request) {

        User newUser = userService.register(request);

        return responseBuilder.success("User", "registered", userMapper.toDtoSimple(newUser), HttpStatus.CREATED);
    }

    @GetMapping("/auth/{email}")
    public ResponseEntity<SmpResponse<UserAuth>> getUserAuth(@PathVariable("email") String email) {

        User user = userService.getByEmail(email);

        return responseBuilder.success("User", "fetched", userMapper.toDtoAuth(user), HttpStatus.OK);
    }

}
