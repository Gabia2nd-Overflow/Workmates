package com.workmates.backend.Util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "this-is-a-very-long-secret-key-at-least-32-bytes!"; 
    private final SecretKey signingKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String getNicknameFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("nickname", String.class); // JWT payload에 nickname이 있어야 함
    }

    public String getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.getSubject(); // 일반적으로 sub에 userId
    }

    private Claims parseToken(String token) {
        return Jwts.parser()              // 0.12.x에서는 parserBuilder() 필요 없음
                .verifyWith(signingKey)   // setSigningKey 대신 verifyWith
                .build()
                .parseSignedClaims(token) // ✅ parseClaimsJws → parseSignedClaims
                .getPayload();
    }


}
