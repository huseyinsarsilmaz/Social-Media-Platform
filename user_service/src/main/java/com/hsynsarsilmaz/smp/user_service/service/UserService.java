package com.hsynsarsilmaz.smp.user_service.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.UserUpdateRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;

public interface UserService {

    public UserSimple getUserSimpleByUsername(String username, Long myId);

    public UserAuth getUserAuth(String username);

    public void isEmailTaken(String email);

    public void isUsernameTaken(String username);

    public void isVerificationValid(String email, String code);

    public UserSimple register(RegisterRequest req);

    public void sendEmailVerification(String email);

    public UserSimple update(UserUpdateRequest req, Long id);

    public UserSimple updateProfilePicture(MultipartFile image, Long userId);

    public UserSimple updateCoverPicture(MultipartFile image, Long userId);

    public List<UserSimple> getUsersByIds(List<Long> ids, int page);

    public User getEntityById(Long id);

}
