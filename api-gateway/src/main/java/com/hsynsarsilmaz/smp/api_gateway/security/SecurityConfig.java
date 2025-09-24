package com.hsynsarsilmaz.smp.api_gateway.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsynsarsilmaz.smp.common.model.dto.response.SmpResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final UserIdHeaderGatewayFilter userIdHeaderGatewayFilter;

        @Value("#{'${frontend.urls}'.split(',')}")
        private List<String> allowedOrigins;

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        private void handleExceptionInFilterChain(HttpServletRequest request, HttpServletResponse response,
                        RuntimeException exception, int responseCode) throws IOException {
                SmpResponse<String> apiResponse = new SmpResponse<>(false,
                                "Unauthorized: " + exception.getMessage(), null);
                response.setStatus(responseCode);
                response.setContentType("application/json");
                response.getWriter().write(new ObjectMapper().writeValueAsString(apiResponse));
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOriginPatterns(allowedOrigins);
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(Customizer.withDefaults())
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/auth/register", "/auth/login",
                                                                "/users/verification/email", "/users/images/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .sessionManagement(sess -> sess
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint((request, response,
                                                                authException) -> handleExceptionInFilterChain(request,
                                                                                response, authException,
                                                                                HttpServletResponse.SC_UNAUTHORIZED))
                                                .accessDeniedHandler((request, response,
                                                                accessDeniedException) -> handleExceptionInFilterChain(
                                                                                request,
                                                                                response, accessDeniedException,
                                                                                HttpServletResponse.SC_FORBIDDEN)))
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterAfter(userIdHeaderGatewayFilter, JwtAuthFilter.class);

                return http.build();
        }

}
