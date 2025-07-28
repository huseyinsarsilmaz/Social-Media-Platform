package com.hsynsarsilmaz.smp.feed_service.feign;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;
import com.hsynsarsilmaz.smp.feed_service.model.dto.response.UserSimple;

@FeignClient(name = "USER-SERVICE", configuration = FeignConfig.class)
public interface UserService {
    @GetMapping("api/users/batch")
    ResponseEntity<SmpResponse<List<UserSimple>>> getUsersByIds(
            @RequestParam("ids") List<Long> ids,
            @RequestParam("page") int page);

}