package com.hsynsarsilmaz.smp.feed_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.common.util.SmpResponseBuilder;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.FeedSimple;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.FeedSimpleWithError;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostWithUserAndReplies;
import com.hsynsarsilmaz.smp.feed_service.service.FeedService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/feed")
@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;
    private final SmpResponseBuilder responseBuilder;

    @GetMapping
    public ResponseEntity<SmpResponse<FeedSimple>> getFeed(
            @RequestHeader("X-USER-ID") String userIdS,
            @RequestParam(defaultValue = "0") int page) {

        Long userId = Long.parseLong(userIdS);
        FeedSimpleWithError feed = feedService.getFeed(page, userId);
        if (feed.getMessage() != null) {
            return responseBuilder.failStaticMessage(feed.getMessage(), feed.getErrorCode());
        }

        FeedSimple response = new FeedSimple(feed.getContent(), feed.getPage(), feed.isLast());

        return responseBuilder.success("Feed", "fetched", response, HttpStatus.OK);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<SmpResponse<PostWithUserAndReplies>> getPostWithReplies(@PathVariable("postId") Long postId) {

        PostWithUserAndReplies result = feedService.getPostWithReplies(postId);

        return responseBuilder.success("Post with replies", "fetched", result, HttpStatus.OK);
    }

}
