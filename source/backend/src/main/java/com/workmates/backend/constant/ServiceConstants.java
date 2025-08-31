package com.workmates.backend.constant;

public class ServiceConstants {
    
    public static final String ID_REGEX = "^[a-z0-9]{4,20}$";

    public static final String PW_REGEX = "[A-Za-z0-9]{8,20}$";

    public static final String NICKNAME_REGEX = "^[가-힣A-Za-z0-9]{1, 20}$";

    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    public static final String CODE_REGEX = "^\\d{6}$";

}
