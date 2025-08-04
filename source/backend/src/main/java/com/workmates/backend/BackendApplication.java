package com.workmates.backend;

import java.util.concurrent.CompletableFuture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import com.workmates.backend.external_api.open_ai_api.OpenAiApiService;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) throws Exception {
		ConfigurableApplicationContext context = SpringApplication.run(BackendApplication.class, args);

		OpenAiApiService service = context.getBean(OpenAiApiService.class);

		CompletableFuture<String> ans = service.translateAsync("hello", "English", "Korean")
		.thenApply(result -> {
			System.out.println(result);
			return result;
		})
		.exceptionally(err -> {
			err.printStackTrace();
			return null;
		});

	}
}
