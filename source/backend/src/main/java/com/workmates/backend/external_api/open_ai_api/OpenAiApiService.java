package com.workmates.backend.external_api.open_ai_api;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class OpenAiApiService {

    // application.yml에서 base64 인코딩된 키 주입
    @Value("${open-ai-api.encrypted}")
    private String encryptedApiKey;

    private String decryptedApiKey = null;

    // API URL과 모델명도 분리
    @Value("${open-ai-api.url}")
    private String apiUrl;

    @Value("${open-ai-api.model}")
    private String model;

    private String getDecryptedApiKey() {
        if(decryptedApiKey != null) return decryptedApiKey;
        
        byte[] bytes = Base64.getDecoder().decode(encryptedApiKey);
        decryptedApiKey = new String(bytes);

        return decryptedApiKey;
    }

    public String translate(String text, String sourceLang, String targetLang) throws IOException {
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + getDecryptedApiKey());
        conn.setDoOutput(true);

        ObjectMapper mapper = new ObjectMapper();

        // JSON 요청 바디 생성
        ObjectNode messageObj = mapper.createObjectNode();
        messageObj.put("role", "user");
        messageObj.put("content", "Translate the following text from " + sourceLang + " to" + targetLang + ":\n" + text);

        ArrayNode messagesArray = mapper.createArrayNode();
        messagesArray.add(messageObj);

        ObjectNode jsonBody = mapper.createObjectNode();
        jsonBody.put("model", model);
        jsonBody.set("messages", messagesArray);
        jsonBody.put("max_tokens", 100);

        // 요청 바디 스트림에 쓰기
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = mapper.writeValueAsBytes(jsonBody);
            os.write(input, 0, input.length);
        }

        int responseCode = conn.getResponseCode();
        InputStream is = (responseCode == 200) ? conn.getInputStream() : conn.getErrorStream();

        // 응답 읽기
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, "utf-8"))) {
            StringBuilder responseBuilder = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                responseBuilder.append(line.trim());
            }

            // JSON 파싱
            JsonNode root = mapper.readTree(responseBuilder.toString());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message");
                return message.path("content").asText();
            } else {
                return null;
            }
        }
    }
}