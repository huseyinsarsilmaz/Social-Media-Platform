package com.hsynsarsilmaz.smp.api_gateway.service;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.LoginRequest;


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

}
