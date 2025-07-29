package com.hsynsarsilmaz.smp.user_service.service.Impl;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hsynsarsilmaz.smp.common.exception.AlreadyExistsException;
import com.hsynsarsilmaz.smp.common.exception.NotFoundException;
import com.hsynsarsilmaz.smp.user_service.exception.VerificationCodeInvalidException;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.RegisterRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.request.UserUpdateRequest;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserAuth;
import com.hsynsarsilmaz.smp.user_service.model.dto.response.UserSimple;
import com.hsynsarsilmaz.smp.user_service.model.entity.User;
import com.hsynsarsilmaz.smp.user_service.model.mapper.UserMapper;
import com.hsynsarsilmaz.smp.user_service.repository.UserRepository;
import com.hsynsarsilmaz.smp.user_service.service.FollowingService;
import com.hsynsarsilmaz.smp.user_service.service.UserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate;
    private final JavaMailSender mailSender;
    private final CacheManager cacheManager;

    private static final long VERIFICATION_CODE_TTL_MINUTES = 10;

    private FollowingService followingService;

    @Autowired
    public void setFollowingService(@Lazy FollowingService followingService) {
        this.followingService = followingService;
    }

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${user.images.upload.path}")
    private String uploadPath;

    private User getEntityByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("User", "username"));
    }

    public User getEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User", "id"));
    }

    @Cacheable(value = "userSimple", key = "#username")
    public UserSimple getUserSimpleByUsername(String username, Long myId) {
        User user = getEntityByUsername(username);
        UserSimple userSimple = userMapper.toDtoSimple(user);
        userSimple.setFollowing(followingService.isFollowing(myId, user.getId()));
        return userSimple;
    }

    @Cacheable(value = "userAuth", key = "#username")
    public UserAuth getUserAuth(String username) {
        User user = getEntityByUsername(username);
        return userMapper.toDtoAuth(user);
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

    public void isVerificationValid(String cachedCode, String code) {

        if (cachedCode == null || !cachedCode.equals(code)) {
            throw new VerificationCodeInvalidException("Email verification", "code");
        }

    }

    @Transactional
    public UserSimple register(RegisterRequest req) {
        String redisKey = "email-verification:" + req.getEmail();
        String cachedCode = redisTemplate.opsForValue().get(redisKey);

        isVerificationValid(cachedCode, req.getEmailVerification());
        isEmailTaken(req.getEmail());
        isUsernameTaken(req.getUsername());

        User newUser = userMapper.toEntity(req);
        newUser.setRole(User.Role.ROLE_USER);
        newUser.setPassword(passwordEncoder.encode(req.getPassword()));

        redisTemplate.delete(redisKey);

        newUser = userRepository.save(newUser);

        return userMapper.toDtoSimple(newUser);
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

    private void evictCache(String cacheName, String key) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
        }
    }

    private void evictFeedUsersCache() {
        Cache cache = cacheManager.getCache("feedUsers");
        String key = "page:";
        if (cache != null) {
            for (int page = 0;; page++) {
                if (!cache.evictIfPresent(key + page)) {
                    break;
                }
            }
        }
    }

    @Transactional
    public UserSimple update(UserUpdateRequest req, Long id) {
        User user = getEntityById(id);

        if (!user.getEmail().equals(req.getEmail())) {
            isEmailTaken(req.getEmail());
        }

        if (!user.getUsername().equals(req.getUsername())) {
            isUsernameTaken(req.getUsername());
            evictCache("userAuth", user.getUsername());

        }

        evictCache("userSimple", user.getUsername());
        evictFeedUsersCache();

        userMapper.updateEntity(user, req);
        user = userRepository.save(user);

        return userMapper.toDtoSimple(user);
    }

    private String uploadImage(MultipartFile image, String path, String fileName) throws IOException {
        String folder = uploadPath + "/" + path;
        new File(folder).mkdirs();

        if (image != null && !image.isEmpty()) {
            String filePath = folder + "/" + fileName;
            image.transferTo(new File(filePath));
            return path + "/" + fileName;
        }

        return null;
    }

    public UserSimple updateProfilePicture(MultipartFile image, Long userId) {
        User user = getEntityById(userId);
        String relativeImagePath = null;
        try {
            relativeImagePath = uploadImage(image, userId.toString(), "profilePicture.jpg");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        user.setProfilePicture(relativeImagePath);
        user = userRepository.save(user);

        return userMapper.toDtoSimple(user);
    }

    public UserSimple updateCoverPicture(MultipartFile image, Long userId) {
        User user = getEntityById(userId);
        String relativeImagePath = null;
        try {
            relativeImagePath = uploadImage(image, userId.toString(), "coverPicture.jpg");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

        user.setCoverPicture(relativeImagePath);
        user = userRepository.save(user);

        return userMapper.toDtoSimple(user);
    }

    @Cacheable(value = "feedUsers", key = "':page:' + #page")
    public List<UserSimple> getUsersByIds(List<Long> ids, int page) {
        List<User> users = userRepository.findAllById(ids);
        return users.stream()
                .map(userMapper::toDtoSimple)
                .toList();
    }

}
