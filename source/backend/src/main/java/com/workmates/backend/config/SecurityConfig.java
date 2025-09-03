package com.workmates.backend.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User; // ★ 추가
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // ★ 추가
import org.springframework.util.StringUtils; // ★ 추가
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter; // ★ 추가

import jakarta.servlet.FilterChain;              // ★ 추가
import jakarta.servlet.ServletException;         // ★ 추가
import jakarta.servlet.http.HttpServletRequest;  // ★ 추가
import jakarta.servlet.http.HttpServletResponse; // ★ 추가

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * ✅ 얇은 JWT 필터 Bean (내부 익명 클래스)
     * - JwtTokenProvider는 이미 @Component 이므로 메서드 파라미터로 자동 주입됨
     */
    @Bean
    public OncePerRequestFilter jwtAuthFilter(JwtTokenProvider jwtTokenProvider) {
        return new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                    throws ServletException, IOException {

                String bearer = request.getHeader("Authorization");
                String token = (StringUtils.hasText(bearer) && bearer.startsWith("Bearer "))
                        ? bearer.substring(7)
                        : null;

                try {
                    if (StringUtils.hasText(token) && jwtTokenProvider.validateToken(token)) {
                        // ★ 토큰 subject 에 사용자 id 저장되어 있음
                        String userId = jwtTokenProvider.getUsernameFromToken(token);

                        // ★ DB 조회 없이 스프링 기본 User 사용 (권한 필요 없으면 빈 리스트)
                        User principal = new User(userId, "", Collections.emptyList());

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

                        // 세부 정보 세팅(선택)
                        auth.setDetails(new org.springframework.security.web.authentication.WebAuthenticationDetailsSource()
                                .buildDetails(request));

                        // SecurityContext에 인증 저장
                        org.springframework.security.core.context.SecurityContextHolder.getContext()
                                .setAuthentication(auth);
                    }
                } catch (Exception ignore) {
                    org.springframework.security.core.context.SecurityContextHolder.clearContext();
                }

                chain.doFilter(request, response);
            }
        };
    }

    /**
     * ✅ 필터 체인: 워크숍 API는 인증 필요 + JWT 필터 연결
     * - 아래처럼 @Bean 메서드 파라미터로 jwtAuthFilter를 바로 주입받아 사용할 수 있음
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, OncePerRequestFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Swagger
                .requestMatchers("/swagger-ui/**", "/api-docs/**").permitAll()
                // Auth 공개 (회원가입/로그인/이메일 인증)
                .requestMatchers("/api/auth/**").permitAll()
                // WebSocket 핸드셰이크
                .requestMatchers("/ws-stomp").permitAll()
                // CORS Preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/threads/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/mate/**").permitAll()
                .requestMatchers("/api/block/**").permitAll()

                // 🔸 여기를 authenticated로 바꿔야 컨트롤러 전에 JWT 인증이 동작함
                .requestMatchers("/api/workshops/**").authenticated()

                // 나머지
                .anyRequest().authenticated()
            )
            // 🔸 위에서 만든 jwtAuthFilter를 UsernamePasswordAuthenticationFilter 앞에 투입
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

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