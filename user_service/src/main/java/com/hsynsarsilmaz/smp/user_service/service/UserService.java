package com.hsynsarsilmaz.smp.user_service.service;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;

public interface UserService {

    /**
     * Retrieves a user by their email address.
     *
     * @param email the email to search for
     * @return the {@link User} object if found
     * @throws NotFoundException if no user is found with the given email
     */
    public User getByEmail(String email);

    /**
     * Checks if the given email is already associated with an existing user.
     * 
     * @param email the email address to check for uniqueness
     * @throws AlreadyExistsException if the email is already taken by an existing
     *                                user
     */
    public void isEmailTaken(String email);

    /**
     * Registers a new user with the provided registration details.
     * <p>
     * Checks if the email is already taken, encodes the password,
     * assigns a default user role, and saves the new user to the database.
     *
     * @param req the registration request containing user details
     * @return the newly registered {@link User} entity
     * @throws AlreadyExistsException if the email is already in use
     */
    public User register(RegisterRequest req);

}
