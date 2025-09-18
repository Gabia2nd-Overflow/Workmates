package com.workmates.backend.external_api.llamaindex_api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class LlamaIndexController {
    
    private final LlamaindexService llamaindexService;

    
}
