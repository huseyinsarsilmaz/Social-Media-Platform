package com.hsynsarsilmaz.smp.user_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${user.images.upload.path}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String resourceHandler = "/users/images/**";
        String resourceLocation = "file:" + uploadPath;

        registry.addResourceHandler(resourceHandler)
                .addResourceLocations(resourceLocation);
    }
}