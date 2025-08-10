package com.workmates.backend.domain;

public class DomainConstants { // domain 패키지에서 사용될 상수값 정의
    
    // 아이디나 닉네임 등으로 사용될 짧은 문자열의 최대 길이
    public static final int ID_MAX_LEN = 32;

    // 댓글이나 메세지 또는 소개 등으로 사용될 문자열의 최대 길이
    public static final int COMMENT_MAX_LEN = 128;
    
    // 포스트에 사용될 긴 문자열의 최대 길이
    public static final int POST_MAX_LEN = 2048;

    // 기본값으로 사용되는 언어
    public static final String DEFAULT_LANGUAGE = "Korean";
}
