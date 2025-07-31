package com.workmates.backend.external_api.google_translate_api;

import com.google.cloud.translate.v3.LocationName;
import com.google.cloud.translate.v3.TranslateTextRequest;
import com.google.cloud.translate.v3.TranslateTextResponse;
import com.google.cloud.translate.v3.TranslationServiceClient;

// 기능 방향
// 이메일(최우선순위), 개인 메세지(DM), 포스트(게시글), 코멘트(댓글)에 적용 가능해야함
// 실제 화면에서 텍스트의 국적이 같다면 번역이 적용되지 않고, 다르다면 적용할 수도, 적용하지 않을 수도 있음
// 번역된 문장 <-> 번역 전 원문으로의 전환이 가능해야함

public class GoogleTranslateAPI {

    // 프로젝트 ID 및 위치(global 권장)
    private static final String PROJECT_ID = "grounded-vision-467403-f8";
    private static final String LOCATION = "global";

    public static void main(String[] args) {
        try (TranslationServiceClient client = TranslationServiceClient.create()) {

            LocationName parent = LocationName.of(PROJECT_ID, LOCATION);

            String textToTranslate = "こんにちは";
            String targetLanguage = "ko"; // 한국어

            TranslateTextRequest request = TranslateTextRequest.newBuilder()
                    .setParent(parent.toString())
                    .addContents(textToTranslate)
                    .setMimeType("text/plain")
                    .setTargetLanguageCode(targetLanguage)
                    .build();

            TranslateTextResponse response = client.translateText(request);

            String translatedText = response.getTranslations(0).getTranslatedText();
            System.out.println("Translated text: " + translatedText);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
