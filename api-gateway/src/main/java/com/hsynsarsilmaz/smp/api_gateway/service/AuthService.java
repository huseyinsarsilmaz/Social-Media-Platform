package com.hsynsarsilmaz.smp.api_gateway.service;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;

public interface AuthService {
    /**
     * Registers a new user with the provided registration details.
     * <p>
     * Checks if the email is already taken, encodes the password,
     * assigns a default user role, and saves the new user to the database.
     *
     * @param req the registration request containing user details
     * @return the newly registered {@link User} entity
     * @throws RuntimeException if the email is already in use
     */
    public User register(RegisterRequest req);
}
