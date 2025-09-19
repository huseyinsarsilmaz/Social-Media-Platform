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
import com.hsynsarsilmaz.smp.post_service.model.dto.response.PostWithReplies;
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
        PostSimple newPost = postService.add(req, id);

        return responseBuilder.success("Post", "added", newPost, HttpStatus.CREATED);
    }

    @PostMapping("/reply/{parentId}")
    public ResponseEntity<SmpResponse<PostSimple>> replyPost(
            @RequestHeader("X-USER-ID") String userIds,
            @PathVariable("parentId") Long parentId,
            @Valid @RequestBody AddPostRequest req) {

        Long userId = Long.parseLong(userIds);
        PostSimple newPost = postService.reply(req, parentId, userId);

        return responseBuilder.success("Post", "replied", newPost, HttpStatus.CREATED);
    }

    @PostMapping("/repost/{parentId}")
    public ResponseEntity<SmpResponse<PostSimple>> repostPost(
            @RequestHeader("X-USER-ID") String userIds,
            @PathVariable("parentId") Long parentId) {

        Long userId = Long.parseLong(userIds);
        PostSimple newPost = postService.repost(parentId, userId);

        return responseBuilder.success("Post", "reposted", newPost, HttpStatus.CREATED);
    }

    @DeleteMapping("/unrepost/{parentId}")
    public ResponseEntity<SmpResponse<PostSimple>> unrepostPost(
            @RequestHeader("X-USER-ID") String userIds,
            @PathVariable("parentId") Long parentId) {

        Long userId = Long.parseLong(userIds);
        PostSimple newPost = postService.unrepost(parentId, userId);

        return responseBuilder.success("Post", "unreposted", newPost, HttpStatus.OK);
    }

    @PostMapping("/quote/{parentId}")
    public ResponseEntity<SmpResponse<PostSimple>> quotePost(
            @RequestHeader("X-USER-ID") String userIds,
            @PathVariable("parentId") Long parentId,
            @Valid @RequestBody AddPostRequest req) {

        Long userId = Long.parseLong(userIds);
        PostSimple newPost = postService.quote(req, parentId, userId);

        return responseBuilder.success("Post", "quoted", newPost, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<SmpResponse<PaginatedResponse<PostSimple>>> getMyPosts(
            @PathVariable("userId") Long userId,
            @RequestParam(defaultValue = "0") int page) {

        Page<PostSimple> posts = postService.getByUserId(userId, page);

        return responseBuilder.success("My Posts", "fetched", new PaginatedResponse<PostSimple>(posts), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SmpResponse<PostSimple>> updatePost(
            @RequestHeader("X-USER-ID") String userId,
            @PathVariable("id") Long postId,
            @Valid @RequestBody UpdatePostRequest req) {

        Long usrId = Long.parseLong(userId);
        PostSimple post = postService.update(req, postId, usrId);

        return responseBuilder.success("Post", "updated", post, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SmpResponse<PostSimple>> deletePost(
            @RequestHeader("X-USER-ID") String userIdS,
            @PathVariable("id") Long postId) {

        Long userId = Long.parseLong(userIdS);
        PostSimple post = postService.delete(postId, userId);

        return responseBuilder.success("Post", "deleted", post, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<SmpResponse<PaginatedResponse<PostSimple>>> getAllPosts(
            @RequestParam long userId,
            @RequestParam(defaultValue = "0") int page) {

        Page<PostSimple> posts = postService.getGlobalFeed(page, userId);

        return responseBuilder.success("All Posts", "fetched", new PaginatedResponse<PostSimple>(posts), HttpStatus.OK);
    }

    @PostMapping("/like/{postId}")
    public ResponseEntity<SmpResponse<PostSimple>> likePost(
            @RequestHeader("X-USER-ID") String userIdS,
            @PathVariable Long postId) {

        Long userId = Long.parseLong(userIdS);
        PostSimple likedPost = postService.like(postId, userId);

        return responseBuilder.success("Post", "liked", likedPost, HttpStatus.OK);
    }

    @DeleteMapping("/unlike/{postId}")
    public ResponseEntity<SmpResponse<PostSimple>> unlikePost(
            @RequestHeader("X-USER-ID") String userIdS,
            @PathVariable Long postId) {

        Long userId = Long.parseLong(userIdS);
        PostSimple likedPost = postService.unlike(postId, userId);

        return responseBuilder.success("Post", "unliked", likedPost, HttpStatus.OK);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<SmpResponse<PostWithReplies>> getPostWithReplies(@PathVariable("postId") Long postId) {

        PostWithReplies postWithReplies = postService.getWithReplies(postId);

        return responseBuilder.success("Post with replies", "fetched", postWithReplies, HttpStatus.OK);
    }

}