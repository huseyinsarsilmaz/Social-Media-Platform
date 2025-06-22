package com.hsynsarsilmaz.smp.user_service.service;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("users/images/**")
                .addResourceLocations("file:C:/Users/Huseyin/Desktop/Social-Media-Platform/uploads/images/");
    }
}