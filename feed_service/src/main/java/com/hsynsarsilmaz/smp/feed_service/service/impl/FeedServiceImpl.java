package com.hsynsarsilmaz.smp.feed_service.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.model.dto.response.PaginatedResponse;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.feed_service.exception.FeignClientHandledException;
import com.hsynsarsilmaz.smp.feed_service.feign.PostService;
import com.hsynsarsilmaz.smp.feed_service.feign.UserService;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.FeedSimpleWithError;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostWithReplies;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostWithUser;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostWithUserAndReplies;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.feed_service.service.FeedService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedServiceImpl implements FeedService {
    private final UserService userService;
    private final PostService postService;

    public FeedSimpleWithError getFeed(int page, long userId) {
        PaginatedResponse<PostSimple> postPage = null;
        List<UserSimple> users = null;
        try {
            SmpResponse<PaginatedResponse<PostSimple>> response = postService.getAllPosts(page, userId).getBody();
            if (response != null) {
                postPage = response.getData();
            } else {
                return new FeedSimpleWithError("Post service is not available", HttpStatus.SERVICE_UNAVAILABLE);
            }

        } catch (FeignClientHandledException e) {
            @SuppressWarnings("unchecked")
            SmpResponse<PaginatedResponse<PostSimple>> response = (SmpResponse<PaginatedResponse<PostSimple>>) e
                    .getResponse();
            return new FeedSimpleWithError(response.getMessage(), e.getStatus());

        }

        List<PostSimple> posts = postPage.getContent();

        if (posts.isEmpty()) {
            return new FeedSimpleWithError(Collections.emptyList(), page, true);
        }

        Set<Long> userIds = posts.stream()
                .map(PostSimple::getUserId)
                .collect(Collectors.toSet());

        try {
            SmpResponse<List<UserSimple>> response = userService.getUsersByIds(new ArrayList<>(userIds), page)
                    .getBody();
            if (response != null) {
                users = response.getData();
            } else {
                return new FeedSimpleWithError("User service is not available", HttpStatus.SERVICE_UNAVAILABLE);
            }

        } catch (FeignClientHandledException e) {
            @SuppressWarnings("unchecked")
            SmpResponse<PaginatedResponse<PostSimple>> response = (SmpResponse<PaginatedResponse<PostSimple>>) e
                    .getResponse();
            return new FeedSimpleWithError(response.getMessage(), e.getStatus());

        }

        Map<Long, UserSimple> postUsers = users.stream()
                .collect(Collectors.toMap(UserSimple::getId, Function.identity()));

        List<PostWithUser> feed = posts.stream()
                .map(post -> new PostWithUser(postUsers.get(post.getUserId()), post))
                .toList();

        return new FeedSimpleWithError(feed, page, postPage.isLast());

    }

    public PostWithUserAndReplies getPostWithReplies(long postId) {
        PostWithReplies pwu = null;
        List<UserSimple> users = null;

        try {
            SmpResponse<PostWithReplies> response = postService.getPostById(postId).getBody();
            if (response != null) {
                pwu = response.getData();
            } else {
                return new PostWithUserAndReplies("Post service is not available", HttpStatus.SERVICE_UNAVAILABLE);
            }

        } catch (FeignClientHandledException e) {
            @SuppressWarnings("unchecked")
            SmpResponse<PaginatedResponse<PostSimple>> response = (SmpResponse<PaginatedResponse<PostSimple>>) e
                    .getResponse();
            return new PostWithUserAndReplies(response.getMessage(), e.getStatus());

        }

        Set<Long> userIds = new HashSet<>();
        if (pwu.getParent() != null) {
            userIds.add(pwu.getParent().getUserId());
        }
        userIds.add(pwu.getSelf().getUserId());
        for (PostSimple post : pwu.getChildren()) {
            userIds.add(post.getUserId());
        }

        try {
            SmpResponse<List<UserSimple>> response = userService.getUsersByIds(new ArrayList<>(userIds), 0)
                    .getBody();
            if (response != null) {
                users = response.getData();
            } else {
                return new PostWithUserAndReplies("User service is not available", HttpStatus.SERVICE_UNAVAILABLE);
            }

        } catch (FeignClientHandledException e) {
            @SuppressWarnings("unchecked")
            SmpResponse<PaginatedResponse<PostSimple>> response = (SmpResponse<PaginatedResponse<PostSimple>>) e
                    .getResponse();
            return new PostWithUserAndReplies(response.getMessage(), e.getStatus());

        }

        Map<Long, UserSimple> postUsers = users.stream()
                .collect(Collectors.toMap(UserSimple::getId, Function.identity()));

        PostWithUserAndReplies result = new PostWithUserAndReplies();
        if (pwu.getParent() != null) {
            result.setParent(new PostWithUser(postUsers.get(pwu.getParent().getUserId()), pwu.getParent()));

        }
        result.setSelf(new PostWithUser(postUsers.get(pwu.getSelf().getUserId()), pwu.getSelf()));
        if (pwu.getChildren() != null) {
            result.setChildren(new ArrayList<PostWithUser>());

            for (PostSimple post : pwu.getChildren()) {
                result.getChildren().add(new PostWithUser(postUsers.get(post.getUserId()), post));
            }

        }
        return result;

    }
}
