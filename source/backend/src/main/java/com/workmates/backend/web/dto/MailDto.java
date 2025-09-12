package com.workmates.backend.web.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.workmates.backend.domain.Address;
import com.workmates.backend.domain.Mail;

import lombok.*;

public class MailDto {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReadMailResponse {
        Mail mail;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReceiveMailResponse {
        List<Mail> mailList;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendMailRequest {
        private String from;
        private String to;
        private String subject;
        private String content;
        private List<MultipartFile> attachments;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendMailResponse {
        private Boolean isMailSent;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GetAddressListResponse {
        List<Address> addressList;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AppendAddressRequest {
        private String email;
        private String alias;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AppendAddressResponse {
        private Boolean isAppended; 
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateAddressRequest {
        private String email;
        private String alias;
        private Boolean deleteAddress;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateAddressResponse {
        private Integer result; // 1이면 수정 완료 2면 삭제 완료
    }
}
