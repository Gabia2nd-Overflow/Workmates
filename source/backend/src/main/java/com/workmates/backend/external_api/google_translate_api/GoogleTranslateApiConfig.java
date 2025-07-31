package com.workmates.backend.external_api.google_translate_api;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "google-translate-api")
public class GoogleTranslateApiConfig {

    // api key의 json 파일 위치, 구글 프로젝트 ID 및 위치(global 권장)
    private String path;
    private String google_project_id;
    private String location;

    public String getPath() {
        return path;
    }

    public String getGoogle_project_id() {
        return google_project_id;
    }

    public String getLocation() {
        return location;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setGoogle_project_id(String google_project_id) {
        this.google_project_id = google_project_id;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
