package com.workmates.backend;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import com.workmates.backend.external_api.open_ai_api.OpenAiApiService;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) throws IOException{
		ConfigurableApplicationContext context = SpringApplication.run(BackendApplication.class, args);
	}

}
