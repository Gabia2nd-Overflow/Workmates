package com.workmates.backend.config;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MailConfig {

    private String userId;

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

    public static MailConfig getSendingMailConfig(String email, String password) {
        MailConfig mailConfig = new MailConfig();

        return mailConfig;
    }

    public static MailConfig getReceivingMailConfig(String email, String password) {
        MailConfig mailConfig = new MailConfig();

        return mailConfig;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        MailConfig other = (MailConfig) obj;
        if (userId == null) {
            if (other.userId != null)
                return false;
        } else if (!userId.equals(other.userId))
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((userId == null) ? 0 : userId.hashCode());
        return result;
    }
}
