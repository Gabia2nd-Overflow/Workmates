package com.workmates.backend.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.domain.Lounge;
import com.workmates.backend.domain.Message;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.LoungeRepository;
import com.workmates.backend.repository.MessageRepository;
import com.workmates.backend.repository.UserRepository;

@SpringBootTest
@Transactional
public class MessageServiceTest {

    @Autowired
    MessageService messageService;

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    LoungeRepository loungeRepository;

    @Autowired
    UserRepository userRepository;

@Test
    void 메시지_전송_성공() {
        // given
        Lounge lounge = loungeRepository.save(Lounge.builder()
                .name("개발방")
                .build());

        User sender = userRepository.save(User.builder()
                .id("sender")
                .password("test1234")
                .nickname("보내는사람")
                .build());

        // when
        Message message = messageService.sendMessage(lounge.getId(), sender.getId(), "안녕하세요!");

        // then
        assertNotNull(message.getId());
        assertEquals("안녕하세요!", message.getContent());
        assertEquals(lounge.getId(), message.getLoungeId());
        assertEquals(sender.getId(), message.getWriterId());
        assertNotNull(message.getWrittenAt());
    }

    @Test
    void 채팅방의_메시지_조회_성공() {
        // given
        Lounge lounge = loungeRepository.save(Lounge.builder()
                .name("개발방")
                .build());

        User sender = userRepository.save(User.builder()
                .id("sender")
                .email("sender@test.com")
                .password("test1234")
                .nickname("보내는사람")
                .build());

        messageRepository.save(Message.builder()
                .loungeId(lounge.getId())
                .writerId(sender.getId())
                .content("첫 번째 메시지")
                .build());

        messageRepository.save(Message.builder()
                .loungeId(lounge.getId())
                .writerId(sender.getId())
                .content("두 번째 메시지")
                .build());

        // when
        List<Message> messages = messageService.getMessages(lounge.getId());

        // then
        assertEquals(2, messages.size());
        assertEquals("첫 번째 메시지", messages.get(0).getContent());
        assertEquals("두 번째 메시지", messages.get(1).getContent());
    }
    
}
