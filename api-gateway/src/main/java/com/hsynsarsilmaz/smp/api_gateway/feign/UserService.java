package com.hsynsarsilmaz.smp.api_gateway.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

@FeignClient(name = "USER-SERVICE")
public interface UserService {

    @GetMapping("/api/users/{email}")
    SmpResponse<UserSimple> getByEmail(@PathVariable("email") String email);

}
