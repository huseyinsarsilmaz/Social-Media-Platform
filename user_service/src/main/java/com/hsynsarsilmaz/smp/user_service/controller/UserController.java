package com.hsynsarsilmaz.smp.user_service.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hsynsarsilmaz.smp.common.model.dto.response.PaginatedResponse;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.EmailVerificationRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.UserUpdateRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.FollowingSimple;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.service.FollowingService;
import com.hsynsarsilmaz.smp.user_service.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final FollowingService followingService;
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

    @GetMapping("/{username}")
    public ResponseEntity<SmpResponse<UserSimple>> getUserByUsername(
            @RequestHeader("X-USER-ID") String myIdS,
            @PathVariable("username") String username) {
        Long myId = Long.parseLong(myIdS);
        UserSimple user = userService.getUserSimpleByUsername(username, myId);

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

    @PostMapping("/profilePicture")
    public ResponseEntity<?> updateProfilePicture(
            @RequestHeader("X-USER-ID") String userId,
            @RequestParam MultipartFile profilePicture) {

        Long id = Long.parseLong(userId);
        UserSimple user = userService.updateProfilePicture(profilePicture, id);
        if (user == null) {
            return responseBuilder.fail("file.upload.failed", null, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseBuilder.success("User profile picture", "updated", user, HttpStatus.OK);
    }

    @PostMapping("/coverPicture")
    public ResponseEntity<?> updateCoverPicture(
            @RequestHeader("X-USER-ID") String userId,
            @RequestParam MultipartFile coverPicture) {

        Long id = Long.parseLong(userId);
        UserSimple user = userService.updateCoverPicture(coverPicture, id);
        if (user == null) {
            return responseBuilder.fail("file.upload.failed", null, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseBuilder.success("User cover picture", "updated", user, HttpStatus.OK);
    }

    @GetMapping("/batch")
    public ResponseEntity<SmpResponse<List<UserSimple>>> getUsersByIds(
            @RequestParam("ids") List<Long> ids,
            @RequestParam("page") int page) {
        List<UserSimple> users = userService.getUsersByIds(ids, page);
        return responseBuilder.success("Users", "fetched", users, HttpStatus.OK);
    }

    @PostMapping("/follow/{followingId}")
    public ResponseEntity<SmpResponse<FollowingSimple>> follow(
            @PathVariable Long followingId,
            @RequestHeader("X-USER-ID") String myIdS) {

        Long myId = Long.parseLong(myIdS);

        FollowingSimple response = followingService.follow(myId, followingId);

        return responseBuilder.success("Following", "created", response, HttpStatus.CREATED);
    }

    @DeleteMapping("/unfollow/{followingId}")
    public ResponseEntity<SmpResponse<FollowingSimple>> unfollow(
            @PathVariable Long followingId,
            @RequestHeader("X-USER-ID") String myIdS) {

        Long myId = Long.parseLong(myIdS);

        FollowingSimple response = followingService.unfollow(myId, followingId);

        return responseBuilder.success("User", "unfollowed", response, HttpStatus.OK);
    }

    @GetMapping("/followings")
    public ResponseEntity<SmpResponse<PaginatedResponse<UserSimple>>> getUserFollowings(
            @RequestParam("id") Long userId,
            @RequestParam(defaultValue = "0") int page) {

        Page<UserSimple> followings = followingService.getFollowingsOfUser(userId, page);

        return responseBuilder.success("Followings", "fetched", new PaginatedResponse<UserSimple>(followings),
                HttpStatus.OK);
    }

    @GetMapping("/followers")
    public ResponseEntity<SmpResponse<PaginatedResponse<UserSimple>>> getUserFollowers(
            @RequestParam("id") Long userId,
            @RequestParam(defaultValue = "0") int page) {

        Page<UserSimple> followers = followingService.getFollowersOfUser(userId, page);

        return responseBuilder.success("Followers", "fetched", new PaginatedResponse<UserSimple>(followers),
                HttpStatus.OK);
    }

}
