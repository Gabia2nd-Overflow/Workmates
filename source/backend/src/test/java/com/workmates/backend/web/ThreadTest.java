package com.workmates.backend.web;

import com.workmates.backend.domain.Thread;
import com.workmates.backend.repository.ThreadRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class ThreadTest {

    @Autowired
    private ThreadRepository threadRepository;

    @Test
    public void threadCrudTest() {
        // 1️⃣ 데이터 생성
        Thread thread = Thread.builder()
                .name("테스트 스레드")
                .workshopId(1L)
                .build();

        // 2️⃣ 저장
        Thread savedThread = threadRepository.save(thread);
        System.out.println("저장된 스레드 ID: " + savedThread.getId());

        // 3️⃣ 조회
        Thread fetchedThread = threadRepository.findById(savedThread.getId()).orElse(null);
        System.out.println("조회된 스레드 이름: " + (fetchedThread != null ? fetchedThread.getName() : "없음"));

        // 4️⃣ 수정
        if (fetchedThread != null) {
            fetchedThread.setName("수정된 스레드");
            threadRepository.save(fetchedThread);
        }

        // 5️⃣ 삭제
        threadRepository.deleteById(savedThread.getId());
        boolean exists = threadRepository.existsById(savedThread.getId());
        System.out.println("삭제 후 존재 여부: " + exists);
    }
}
