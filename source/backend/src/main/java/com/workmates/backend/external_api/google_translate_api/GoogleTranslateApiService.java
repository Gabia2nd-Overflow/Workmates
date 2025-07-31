package com.workmates.backend.external_api.google_translate_api;

import java.io.FileInputStream;

import org.springframework.stereotype.Service;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.TranslateTextRequest;
import com.google.cloud.translate.v3.TranslateTextResponse;
import com.google.cloud.translate.v3.TranslationServiceClient;
import com.google.cloud.translate.v3.TranslationServiceSettings;

@Service
public class GoogleTranslateApiService {

    private final GoogleTranslateApiConfig googleTranslateApiConfig;

    private TranslationServiceSettings settings = null;

    public GoogleTranslateApiService(GoogleTranslateApiConfig googleTranslateApiConfig) {
        this.googleTranslateApiConfig = googleTranslateApiConfig;

        try(FileInputStream credentialsStream = new FileInputStream(googleTranslateApiConfig.getPath())) {
            ServiceAccountCredentials serviceAccountCredentials = ServiceAccountCredentials.fromStream(credentialsStream);
            settings = TranslationServiceSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(serviceAccountCredentials))
                .build();

        } catch(Exception e) {
            e.printStackTrace();
        }
    } 

    // 하나의 String에 묶인 문장(들)을 번역하고자 하는 언어코드에 맞게 일괄적으로 요청해서 하나의 String으로 반환
    public String getTranslatedText(final String originalText, final String targetLanguageCode) { 
        try (TranslationServiceClient client = TranslationServiceClient.create(settings)){
            LocationName parent = LocationName.of(googleTranslateApiConfig.getGoogle_project_id(), googleTranslateApiConfig.getLocation());
        
            TranslateTextRequest request = TranslateTextRequest.newBuilder()
                    .setParent(parent.toString())
                    .addContents(originalText)
                    .setMimeType("text/plain")
                    .setTargetLanguageCode(targetLanguageCode)
                    .build();

            TranslateTextResponse response = client.translateText(request);

            String translatedText = response.getTranslations(0).getTranslatedText();

            return translatedText;

        } catch(Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
