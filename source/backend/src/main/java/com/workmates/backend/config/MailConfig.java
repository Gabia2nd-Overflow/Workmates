package com.workmates.backend.config;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MailConfig {

    // 공통
    private String username;
    private String password;
    
    // 송신 세팅
    private String sendingProtocol;
    private String sendingHost;
    private String sendingPort;

    // 수신 세팅
    private String receivingProtocol;
    private String receivingHost;
    private String receivingPort;

    public static MailConfig getMailConfig(String email, String password) {
        MailConfig mailConfig = new MailConfig();

        return mailConfig;
    }

}
