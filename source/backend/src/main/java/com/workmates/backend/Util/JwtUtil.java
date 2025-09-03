// package com.workmates.backend.Util;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.security.Keys;
// import io.jsonwebtoken.SignatureAlgorithm;

// import java.nio.charset.StandardCharsets;
// import java.security.Key;
// import java.util.Date;

// public class JwtUtil {

//     // HS512용 안전한 최소 64바이트 이상 키 (512비트)
//     private static final String SECRET = "this-is-a-very-long-secret-key-for-hs512-which-is-more-than-64-bytes-long-to-be-safe!!!";
//     private static final Key key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

//     // 토큰 생성
//     public static String generateToken(String nickname) {
//         long nowMillis = System.currentTimeMillis();
//         long expMillis = nowMillis + 1000 * 60 * 60; // 1시간
//         Date now = new Date(nowMillis);
//         Date exp = new Date(expMillis);

//         return Jwts.builder()
//                 .setSubject(nickname)
//                 .setIssuedAt(now)
//                 .setExpiration(exp)
//                 .signWith(key, SignatureAlgorithm.HS512) // HS512 명시
//                 .compact();
//     }

//     // Claims 파싱
//     private static Claims parseToken(String token) {
//         return Jwts.parser()
//                 .setSigningKey(key)
//                 .parseClaimsJws(token)
//                 .getBody();
//     }

//     // 닉네임 추출
//     public static String getNicknameFromToken(String token) {
//         return parseToken(token).getSubject();
//     }
// }
