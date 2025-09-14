package com.workmates.backend.config;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MailReceiveConfig {
    
    private String protocol;
    private String host;
    private int port;
    private String username;
    private String password;
    private String folderName;
    private boolean sslEnable;
    private boolean startTlsEnable;
    private int connectionTimeout;
    private int readTimeout;

    public static MailReceiveConfig gmailImapConfig(String email, String password) {
        MailReceiveConfig config = new MailReceiveConfig();
        config.protocol = "imap";
        config.host = "imap.gmail.com";
        config.port = 993;
        config.username = email;
        config.password = password;
        config.folderName = "INBOX";
        config.sslEnable = true;
        config.connectionTimeout = 5000;
        config.readTimeout = 5000;
        return config;
    }
}
