package com.hsynsarsilmaz.smp.user_service.service;

import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;

public interface UserService {

    public UserSimple getUserSimple(String username);

    public UserAuth getUserAuth(String username);

    public void isEmailTaken(String email);

    public void isUsernameTaken(String username);

    public void isVerificationValid(String email, String code);

    public UserSimple register(RegisterRequest req);

    public void sendEmailVerification(String email);

}
