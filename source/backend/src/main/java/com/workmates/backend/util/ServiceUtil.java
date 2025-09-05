package com.workmates.backend.util;

import java.util.regex.Pattern;

public class ServiceUtil {
    
    private static final String ID_REGEX = "^[a-z0-9]{4,20}$";

    private static final String PW_REGEX = "[A-Za-z0-9]{8,20}$";

    private static final String NICKNAME_REGEX = "^[가-힣A-Za-z0-9]{1,20}$";

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    private static final String CODE_REGEX = "^\\d{6}$";

    public static Boolean validateId(String id) {
        return Pattern.matches(ID_REGEX, id);
    }

    public static Boolean validatePassword(String password) {
        return Pattern.matches(PW_REGEX, password);
    }

    public static Boolean validateNickname(String nickname) {
        return Pattern.matches(NICKNAME_REGEX, nickname);
    }

    public static Boolean validateEmail(String email) {
        return Pattern.matches(EMAIL_REGEX, email);
    }

    public static Boolean validateCode(String code) {
        return Pattern.matches(CODE_REGEX, code);
    }
}
