package com.hsynsarsilmaz.smp.user_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.EmailVerificationRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.UserUpdateRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SmpResponseBuilder responseBuilder;

    @PostMapping("/verification/email")
    public ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody EmailVerificationRequest req) {

        userService.sendEmailVerification(req.getEmail());

        return responseBuilder.success("Verification mail", "sent", null, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody RegisterRequest req) {

        UserSimple newUser = userService.register(req);

        return responseBuilder.success("User", "registered", newUser, HttpStatus.CREATED);
    }

    @GetMapping("/auth/{username}")
    public ResponseEntity<SmpResponse<UserAuth>> getUserAuth(@PathVariable("username") String username) {

        UserAuth user = userService.getUserAuth(username);

        return responseBuilder.success("User", "fetched", user, HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<SmpResponse<UserSimple>> getOwnUser(@RequestHeader("X-USER-ID") String userId) {
        Long id = Long.parseLong(userId);
        UserSimple user = userService.getUserSimple(id);

        return responseBuilder.success("User", "fetched", user, HttpStatus.OK);
    }

    @PutMapping("/me")
    public ResponseEntity<SmpResponse<UserSimple>> updateOwnUser(
            @RequestHeader("X-USER-ID") String userId,
            @Valid @RequestBody UserUpdateRequest req) {

        Long id = Long.parseLong(userId);
        UserSimple newUser = userService.update(req, id);

        return responseBuilder.success("User", "updated", newUser, HttpStatus.OK);
    }

}
