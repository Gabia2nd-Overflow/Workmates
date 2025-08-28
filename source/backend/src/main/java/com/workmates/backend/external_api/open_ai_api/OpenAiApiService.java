package com.workmates.backend.external_api.open_ai_api;

import java.net.URI;
import java.net.http.*;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.workmates.backend.domain.Comment;

@Service
public class OpenAiApiService {

    // application.yml에서 base64 인코딩된 키 주입
    @Value("${open-ai-api.encrypted}")
    private String encryptedApiKey;

    private String decryptedApiKey = null;

    @Value("${open-ai-api.chat.url}")
    private String chatApiUrl;

    @Value("${open-ai-api.image-generate.url}")
    private String imageGenerateApiUrl;

    @Value("${open-ai-api.chat.model}")
    private String chatModel;

    @Value("${open-ai-api.image-generate.model}")
    private String imageGenerateModel;

    private String getDecryptedApiKey() {
        if(decryptedApiKey != null) return decryptedApiKey;
        
        byte[] bytes = Base64.getDecoder().decode(encryptedApiKey);
        decryptedApiKey = new String(bytes);

        return decryptedApiKey;
    }

    public CompletableFuture<String> translateAsync(String text, String sourceLang, String targetLang) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();

        ObjectNode messageObj = mapper.createObjectNode();
        messageObj.put("role", "user");
        messageObj.put("content", "Translate the following text from " + sourceLang + " to " + targetLang + ":\n" + text);

        ArrayNode messagesArray = mapper.createArrayNode();
        messagesArray.add(messageObj);

        ObjectNode jsonBody = mapper.createObjectNode();
        jsonBody.put("model", chatModel);
        jsonBody.set("messages", messagesArray);
        jsonBody.put("max_tokens", 100);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(chatApiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + getDecryptedApiKey())
                .POST(HttpRequest.BodyPublishers.ofByteArray(mapper.writeValueAsBytes(jsonBody)))
                .build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenApply(response -> {
                try {
                    JsonNode root = mapper.readTree(response);
                    JsonNode choices = root.path("choices");
                    if (choices.isArray() && choices.size() > 0) {
                        JsonNode message = choices.get(0).path("message");
                        return message.path("content").asText();
                    } else {
                        return null;
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
        });
    }
    // dall-e-3의 size 값은 '1024x1024', '1024x1792', '1792x1024'만 가능
    public CompletableFuture<String> generateImageAsync(String prompt) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();

        ObjectNode jsonBody = mapper.createObjectNode();
        jsonBody.put("model", imageGenerateModel);
        jsonBody.put("prompt", prompt);
        jsonBody.put("n", 1); // dall-e-3는 1장 고정
        jsonBody.put("size", "1024x1024"); // 1024*1024로 고정

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(imageGenerateApiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + getDecryptedApiKey())
                .POST(HttpRequest.BodyPublishers.ofByteArray(mapper.writeValueAsBytes(jsonBody)))
                .build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenApply(response -> {
                try {
                    JsonNode root = mapper.readTree(response);
                    JsonNode data = root.get("data");
                    if(data.isArray() && data.size() > 0) {
                        String url = data.get(0).get("url").asText();
                        return url;
                    } else {
                        return null;
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
        });
    }

    public CompletableFuture<String> sentimentAnalysisAsync(List<String> commentList) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        ObjectMapper mapper = new ObjectMapper();

        StringBuilder comments = new StringBuilder();
        // commentList.sort((c1, c2) -> (int) (c2.getId() - c1.getId()));
        for(int s = 0, e = Math.min(commentList.size(), 30); s < e; ++s) {
            comments.append(String.valueOf(s + 1) + ". ");
            comments.append(commentList.get(s));
            comments.append(" ");
        }

        ObjectNode messageObj = mapper.createObjectNode();
        messageObj.put("role", "user");
        messageObj.put("content", "주어진 댓글들의 감성을 분석해서 전체적인 반응을 긍정적/대체로 긍정적/중립적/대체로 부정적/부정적 중 하나로 단답으로 대답해.\n" + comments);


        ArrayNode messagesArray = mapper.createArrayNode();
        messagesArray.add(messageObj);

        ObjectNode jsonBody = mapper.createObjectNode();
        jsonBody.put("model", chatModel);
        jsonBody.set("messages", messagesArray);
        jsonBody.put("max_tokens", 100);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(chatApiUrl))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + getDecryptedApiKey())
                .POST(HttpRequest.BodyPublishers.ofByteArray(mapper.writeValueAsBytes(jsonBody)))
                .build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
            .thenApply(HttpResponse::body)
            .thenApply(response -> {
                try {
                    JsonNode root = mapper.readTree(response);
                    JsonNode choices = root.path("choices");
                    if (choices.isArray() && choices.size() > 0) {
                        JsonNode message = choices.get(0).path("message");
                        return message.path("content").asText();
                    } else {
                        return null;
                    }
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
        });
    }
}