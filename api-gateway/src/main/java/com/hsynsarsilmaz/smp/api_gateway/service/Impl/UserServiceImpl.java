package com.hsynsarsilmaz.smp.api_gateway.service.Impl;

import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;
import com.hsynsarsilmaz.smp.api_gateway.repository.UserRepository;
import com.hsynsarsilmaz.smp.api_gateway.service.UserService;
import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User", "email"));
    }

    public void isEmailTaken(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new AlreadyExistsException("User", "email");
        }
    }

}
