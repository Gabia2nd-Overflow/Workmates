package com.workmates.backend.external_api.google_translate_api;

import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.TranslateTextRequest;
import com.google.cloud.translate.v3.TranslateTextResponse;
import com.google.cloud.translate.v3.TranslationServiceClient;

public class GoogleTranslateApi {

    // 구글 프로젝트 ID 및 위치(global 권장)
    public static final String PROJECT_ID = "grounded-vision-467403-f8";
    public static final String LOCATION = "global";

    // 하나의 String에 묶인 문장(들)을 번역하고자 하는 언어코드에 맞게 일괄적으로 요청해서 하나의 String으로 반환
    public static String getTranslatedText(final String originalText, final String targetLanguageCode) { 
        try (TranslationServiceClient client = TranslationServiceClient.create()){
            LocationName parent = LocationName.of(PROJECT_ID, LOCATION);
        
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
