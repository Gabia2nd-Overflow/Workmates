package com.workmates.backend.external_api.open_ai_api;

import org.springframework.beans.factory.annotation.Value;

public class OpenApiConfig {

    @Value("${open-ai-api.encrypted}")
    private String encryptedApiKey;

    public String getEncryptedApiKey() {
        return encryptedApiKey;
    }

    public void setEncryptedApiKey(String encryptedApiKey) {
        this.encryptedApiKey = encryptedApiKey;
    }
}
