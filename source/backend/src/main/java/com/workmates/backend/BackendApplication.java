package com.workmates.backend;

import java.util.List;
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

		List<String> testList = List.of("아주 흥미롭네요.", "전반적으로 시시했습니다.", "아기 거북이 알을 깨고 나오는 과정에서 생명의 신비를 느꼈습니다.", "영상미가 아주 뛰어납니다.", "금세기 최고의 자연 다큐멘터리라고 생각합니다.");

		for(String s : testList) {
			System.out.println(s);
		}
		
		service.sentimentAnalysisAsync(testList)
			.thenApply(res -> {
				System.out.println("분석결과 : " + res);

				return res;
			})
			.exceptionally(ex -> "감성분석에 실패했습니다.");
	}
}
