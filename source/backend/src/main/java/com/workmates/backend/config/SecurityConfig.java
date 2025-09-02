package com.workmates.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                // Swagger
                .requestMatchers("/swagger-ui/**", "/api-docs/**").permitAll()
                // ✅ Auth 공개 (회원가입/로그인 등)
                .requestMatchers("/api/auth/**").permitAll()
                // ✅ Workmates 도메인: 워크샵 단일 prefix로 하위(lounges/messages/files) 전부 포함
                //    프론트 api.js가 호출하는 모든 경로와 일치함
                .requestMatchers("/api/workshops/**").permitAll()
                // ✅ WebSocket 핸드셰이크 (SockJS 미사용이므로 /ws-stomp 만 허용)
                .requestMatchers("/ws-stomp").permitAll()
                // ✅ CORS Preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/threads/**").permitAll()
                // 예: 관리자 API
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // 친구/차단 기능 API
                .requestMatchers("/api/mate/**").permitAll()
                // 나머지(필요 시 잠금)
                .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
