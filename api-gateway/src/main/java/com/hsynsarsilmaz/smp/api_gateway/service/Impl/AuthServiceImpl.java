package com.hsynsarsilmaz.smp.api_gateway.service.Impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.LoginRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.api_gateway.model.entity.User;
import com.hsynsarsilmaz.smp.api_gateway.model.mapper.UserMapper;
import com.hsynsarsilmaz.smp.api_gateway.repository.UserRepository;
import com.hsynsarsilmaz.smp.api_gateway.security.JwtUtil;
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
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public User register(RegisterRequest req) {
        userService.isEmailTaken(req.getEmail());

        User newUser = userMapper.toEntity(req);
        newUser.setRole(User.Role.ROLE_USER);
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));

        return userRepository.save(newUser);
    }

    public String authenticateAndGenerateToken(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        return jwtUtil.generateToken(request.getEmail());
    }

}
