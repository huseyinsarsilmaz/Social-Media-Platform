package com.hsynsarsilmaz.smp.api_gateway.service;

import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;

public interface UserService {

    /**
     * Retrieves a user by their email address.
     *
     * @param email the email to search for
     * @return the User object if found
     * @throws RuntimeException if no user is found with the given email
     */
    public User getByEmail(String email);
}
