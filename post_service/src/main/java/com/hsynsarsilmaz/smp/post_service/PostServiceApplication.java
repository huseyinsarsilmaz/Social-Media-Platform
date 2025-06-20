package com.hsynsarsilmaz.smp.post_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication(scanBasePackages = {
		"com.hsynsarsilmaz.smp.post_service",
		"com.hsynsarsilmaz.smp.common"
})
@EnableCaching
public class PostServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PostServiceApplication.class, args);
	}

}
