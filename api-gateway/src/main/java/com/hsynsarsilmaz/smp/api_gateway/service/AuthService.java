package com.hsynsarsilmaz.smp.api_gateway.service;

import org.springframework.http.ResponseEntity;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.LoginRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;


public interface AuthService {

    public String authenticateAndGenerateToken(LoginRequest request);

    public ResponseEntity<SmpResponse<UserSimple>> register(RegisterRequest req);

}
