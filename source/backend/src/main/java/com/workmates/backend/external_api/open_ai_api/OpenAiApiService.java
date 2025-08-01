package com.workmates.backend.external_api.open_ai_api;

import java.util.Base64;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class OpenAiApiService {

    private final String openAiApiKey;

    private final RestTemplate restTemplate;

    public OpenAiApiService(OpenAiApiConfig openAiApiConfig) {
        String encrypted = openAiApiConfig.getEncryptedApiKey();
        byte[] decrypted = Base64.getDecoder().decode(encrypted);

        openAiApiKey = new String(decrypted);
        restTemplate = new RestTemplate();
    }

    // 텍스트는 단수 혹은 복수의 줄로 구성된 문자열, 타겟은 자연어로 명시된 언어의 명칭(ex: "Korean", "English")
    public String translate(String text, String target) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        String prompt = String.format("Translate the following text to %s: %s", target, text);

        String requestBody = String.format(
            "{ \"model\": \"gpt-3.5-turbo\", \"messages\": [{\"role\": \"user\", \"content\": \"%s\"}] }",
            prompt.replace("\"", "\\\"")
        );

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        
        return response.getBody();
    }
}
