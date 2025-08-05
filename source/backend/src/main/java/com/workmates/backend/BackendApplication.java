package com.workmates.backend;

import java.util.concurrent.CompletableFuture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableAsync;

import com.workmates.backend.external_api.open_ai_api.OpenAiApiService;

@SpringBootApplication
@EnableAsync
public class BackendApplication {

	public static void main(String[] args) throws Exception {
		ConfigurableApplicationContext context = SpringApplication.run(BackendApplication.class, args);

		OpenAiApiService service = context.getBean(OpenAiApiService.class);
	}
}
