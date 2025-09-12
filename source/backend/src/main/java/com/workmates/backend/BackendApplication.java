package com.workmates.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

import com.workmates.backend.external_api.open_ai_api.OpenAiApiService;

@SpringBootApplication

// backend 임시 작동 위한 코드 시작점
@ComponentScan(excludeFilters = {
    @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = {
            com.workmates.backend.service.MailService.class  // 있는 클래스만!
        }
    )
})
@EnableJpaRepositories(
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = {
            com.workmates.backend.repository.MailRepository.class
        }
    )
)

// backend 임시 작동 위한 코드 끝점

@EnableAsync
public class BackendApplication {

	public static void main(String[] args) throws Exception {
		ConfigurableApplicationContext context = SpringApplication.run(BackendApplication.class, args);

		OpenAiApiService service = context.getBean(OpenAiApiService.class);
	}
}
