package com.hsynsarsilmaz.smp.post_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
		"com.hsynsarsilmaz.smp.post_service",
		"com.hsynsarsilmaz.smp.common"
})
public class PostServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PostServiceApplication.class, args);
	}

}
