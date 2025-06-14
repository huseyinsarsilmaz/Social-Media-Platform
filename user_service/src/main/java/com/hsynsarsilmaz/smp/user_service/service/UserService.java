package com.hsynsarsilmaz.smp.user_service.service;

import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;

public interface UserService {

    public User getByEmail(String email);

    public User getByUsername(String username);

    public User getById(Long id);

    public void isEmailTaken(String email);

    public void isUsernameTaken(String username);

    public void isVerificationValid(String email, String code);

    public User register(RegisterRequest req);

    public void sendEmailVerification(String email);

}
