package com.hsynsarsilmaz.smp.api_gateway.service.Impl;

import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;
import com.hsynsarsilmaz.smp.api_gateway.repository.UserRepository;
import com.hsynsarsilmaz.smp.api_gateway.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    // TODO Add custom exception
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("There is no user with this email"));
    }

    // TODO Add custom exception
    public void isEmailTaken(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("There is a user already with this email");
        }
    }

}
