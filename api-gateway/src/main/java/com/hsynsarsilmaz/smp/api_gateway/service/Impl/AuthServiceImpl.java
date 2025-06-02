package com.hsynsarsilmaz.smp.api_gateway.service.Impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;
import com.hsynsarsilmaz.smp.api_gateway.model.mapper.UserMapper;
import com.hsynsarsilmaz.smp.api_gateway.repository.UserRepository;
import com.hsynsarsilmaz.smp.api_gateway.service.AuthService;
import com.hsynsarsilmaz.smp.api_gateway.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest req) {
        userService.isEmailTaken(req.getEmail());

        User newUser = userMapper.toEntity(req);
        newUser.setRole(User.Role.ROLE_USER);
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));

        return userRepository.save(newUser);
    }

}
