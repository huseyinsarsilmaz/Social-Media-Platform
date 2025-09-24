package com.hsynsarsilmaz.smp.api_gateway.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

import jakarta.validation.Valid;

@FeignClient(name = "USER-SERVICE", configuration = FeignConfig.class)
public interface UserService {

    @GetMapping("/api/users/auth/{username}")
    ResponseEntity<SmpResponse<UserAuth>> getByUsername(@PathVariable("username") String username);

    @PostMapping("/api/users/register")
    ResponseEntity<SmpResponse<UserSimple>> register(@Valid @RequestBody RegisterRequest req);

}
