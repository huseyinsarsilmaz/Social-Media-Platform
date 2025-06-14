package com.hsynsarsilmaz.smp.user_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.EmailVerificationRequest;
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

    @PostMapping("/verification/email")
    public ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody EmailVerificationRequest req) {

        userService.sendEmailVerification(req.getEmail());

        return responseBuilder.success("Verification mail", "sent", null, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody RegisterRequest req) {

        User newUser = userService.register(req);

        return responseBuilder.success("User", "registered", userMapper.toDtoSimple(newUser), HttpStatus.CREATED);
    }

    @GetMapping("/auth/{username}")
    public ResponseEntity<SmpResponse<UserAuth>> getUserAuth(@PathVariable("username") String username) {

        User user = userService.getByUsername(username);

        return responseBuilder.success("User", "fetched", userMapper.toDtoAuth(user), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SmpResponse<UserAuth>> getUserAuth(@PathVariable("id") Long id) {
        User user = userService.getById(id);

        return responseBuilder.success("User", "fetched", userMapper.toDtoAuth(user), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<SmpResponse<UserSimple>> getOwnUser(@RequestHeader("X-USERNAME") String username) {
        User user = userService.getByUsername(username);

        return responseBuilder.success("User", "fetched", userMapper.toDtoSimple(user), HttpStatus.OK);
    }

}
