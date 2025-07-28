package com.hsynsarsilmaz.smp.feed_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {
		"com.hsynsarsilmaz.smp.feed_service",
		"com.hsynsarsilmaz.smp.common"
}, exclude = { DataSourceAutoConfiguration.class })
@EnableCaching
@EnableFeignClients
public class FeedServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FeedServiceApplication.class, args);
	}

}
