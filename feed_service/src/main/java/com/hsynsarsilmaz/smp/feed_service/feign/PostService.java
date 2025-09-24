package com.hsynsarsilmaz.smp.feed_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.hsynsarsilmaz.smp.common.model.dto.response.PaginatedResponse;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostSimple;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.PostWithReplies;

@FeignClient(name = "POST-SERVICE", configuration = FeignConfig.class)
public interface PostService {

    @GetMapping("api/posts/all")
    ResponseEntity<SmpResponse<PaginatedResponse<PostSimple>>> getAllPosts(@RequestParam("page") int page,
            @RequestParam("userId") long userId);

    @GetMapping("api/posts/{postId}")
    ResponseEntity<SmpResponse<PostWithReplies>> getPostById(@PathVariable("postId") long postId);

}