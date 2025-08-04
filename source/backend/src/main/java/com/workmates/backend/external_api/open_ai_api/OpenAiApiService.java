package com.workmates.backend.external_api.open_ai_api;

import java.net.URI;
import java.net.http.*;
import java.util.Base64;
import java.util.concurrent.CompletableFuture;

import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageModel;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class OpenAiApiService {

    private final OpenAiImageModel openAiImageModel;

    @Autowired
    public OpenAiApiService(OpenAiImageModel openAiImageModel) {
        this.openAiImageModel = openAiImageModel;
    }

    // application.yml에서 base64 인코딩된 키 주입
    @Value("${open-ai-api.encrypted}")
    private String encryptedApiKey;

    private String decryptedApiKey = null;

    @Value("${open-ai-api.translate.url}")
    private String translateApiUrl;

    @Value("${open-ai-api.translate.model}")
    private String translateModel;

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
        jsonBody.put("model", translateModel);
        jsonBody.set("messages", messagesArray);
        jsonBody.put("max_tokens", 100);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(translateApiUrl))
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

    public CompletableFuture<ImageResponse> generateImageAsync() {
        CompletableFuture<ImageResponse> futureResponse = openAiImageModel.generateAsync(
            new ImagePrompt("A light cream colored mini golden doodle",
            OpenAiImageOptions.builder()
                    .quality("hd")
                    .N(4)
                    .height(1024)
                    .width(1024).build())
        );

        // 응답 처리 (예: 첫번째 이미지 URL 출력)
        futureResponse.thenAccept(response -> {
            var imageUrl = response.getData().get(0).getUrl();
            System.out.println("Generated image URL: " + imageUrl);
        });


    }

}