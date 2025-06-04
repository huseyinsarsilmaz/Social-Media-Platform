package com.hsynsarsilmaz.smp.api_gateway.service;

import org.springframework.http.ResponseEntity;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.LoginRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;


public interface AuthService {
    /**
     * Authenticates a user using their login credentials and generates a JWT token
     * if successful.
     *
     * @param request the login request containing the user's email and password
     * @return a JWT token if authentication is successful
     * @throws AuthenticationException if authenticationfails
     */
    public String authenticateAndGenerateToken(LoginRequest request);

    /**
     * Registers a new user to a system by calling register of user service.
     * <p>
     *
     * @param req the registration request containing user details
     * @return the response from user service
     */
    public ResponseEntity<SmpResponse<UserSimple>> register(RegisterRequest req);

}
