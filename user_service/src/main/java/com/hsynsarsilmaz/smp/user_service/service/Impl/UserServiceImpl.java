package com.hsynsarsilmaz.smp.user_service.service.Impl;

import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.common.exception.NotFoundException;
import com.hsynsarsilmaz.smp.user_service.exception.VerificationCodeInvalidException;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;
import com.hsynsarsilmaz.smp.user_service.model.mapper.UserMapper;
import com.hsynsarsilmaz.smp.user_service.repository.UserRepository;
import com.hsynsarsilmaz.smp.user_service.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate;
    private final JavaMailSender mailSender;

    private static final long VERIFICATION_CODE_TTL_MINUTES = 10;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User", "email"));
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User", "email"));
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User", "id"));
    }

    public void isEmailTaken(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new AlreadyExistsException("User", "email");
        }
    }

    public void isUsernameTaken(String username) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new AlreadyExistsException("User", "username");
        }
    }

    public void isVerificationValid(String email, String code) {
        String redisKey = "email-verification:" + email;
        String cachedCode = redisTemplate.opsForValue().get(redisKey);

        if (cachedCode == null || !cachedCode.equals(code)) {
            throw new VerificationCodeInvalidException("Email verification", "code");
        }

        redisTemplate.delete(redisKey);
    }

    public User register(RegisterRequest req) {
        isVerificationValid(req.getEmail(), req.getEmailVerification());
        isEmailTaken(req.getEmail());
        isUsernameTaken(req.getUsername());

        User newUser = userMapper.toEntity(req);
        newUser.setRole(User.Role.ROLE_USER);
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));

        return userRepository.save(newUser);
    }

    public void sendEmailVerification(String email) {
        isEmailTaken(email);
        String code = String.format("%06d", new Random().nextInt(1_000_000));

        String redisKey = "email-verification:" + email;
        redisTemplate.opsForValue().set(redisKey, code, VERIFICATION_CODE_TTL_MINUTES, TimeUnit.MINUTES);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(email);
        message.setSubject("Your Email Verification Code");
        message.setText("Your verification code is: " + code + "\n\nIt expires in " + VERIFICATION_CODE_TTL_MINUTES
                + " minutes.");

        mailSender.send(message);
    }

}
