package com.hsynsarsilmaz.smp.post_service.controller;


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

import com.hsynsarsilmaz.smp.common.model.dto.response.PaginatedResponse;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.AddPostRequest;
import com.hsynsarsilmaz.smp.post_service.model.dto.request.UpdatePostRequest;
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
    public ResponseEntity<SmpResponse<PaginatedResponse<PostSimple>>> getMyPosts(
            @RequestHeader("X-USER-ID") String userId,
            @RequestParam(defaultValue = "0") int page) {

        Long id = Long.parseLong(userId);
        Page<PostSimple> posts = postService.getByUserId(id, page);

        return responseBuilder.success("My Posts", "fetched", new PaginatedResponse<PostSimple>(posts), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SmpResponse<PostSimple>> updatePost(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable("id") Long postId,
            @Valid @RequestBody UpdatePostRequest req) {

        Long usrId = Long.parseLong(userId);
        PostSimple post = postService.updatePost(req, postId, usrId);

        return responseBuilder.success("Post", "updated", post, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SmpResponse<PostSimple>> deletePost(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable("id") Long postId) {

        Long usrId = Long.parseLong(userId);
        PostSimple post = postService.deletePost(postId, usrId);

        return responseBuilder.success("Post", "deleted", post, HttpStatus.OK);
    }

}