package com.hsynsarsilmaz.smp.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication(scanBasePackages = {
		"com.hsynsarsilmaz.smp.api_gateway",
		"com.hsynsarsilmaz.smp.common"
}, exclude = { DataSourceAutoConfiguration.class })
@EnableDiscoveryClient
@EnableFeignClients
@EnableCaching

public class ApiGatewayApplication {
	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

}
