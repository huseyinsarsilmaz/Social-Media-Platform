package com.hsynsarsilmaz.smp.post_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.post_service.service.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final SmpResponseBuilder responseBuilder;

    @PostMapping
    public ResponseEntity<SmpResponse<PostSimple>> addPost(
            @RequestHeader("X-USER-ID") String userId,
            @Valid @RequestBody AddPostRequest req) {

        Long id = Long.parseLong(userId);
        PostSimple newPost = postService.addPost(req, id);

        return responseBuilder.success("Post", "added", newPost, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<SmpResponse<List<PostSimple>>> getMyPosts(@RequestHeader("X-USER-ID") String userId) {

        Long id = Long.parseLong(userId);
        List<PostSimple> posts = postService.getByUserId(id);

        return responseBuilder.success("My Posts", "fetched", posts, HttpStatus.OK);
    }

}