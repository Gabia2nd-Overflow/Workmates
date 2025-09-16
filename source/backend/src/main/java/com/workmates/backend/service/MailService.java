package com.workmates.backend.service;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.CompletableFuture;

import org.springframework.data.domain.*;
import org.springframework.mail.javamail.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import com.workmates.backend.config.MailReceiveConfig;
import com.workmates.backend.config.SecurityConfig.SymmetricPasswordEncoder;
import com.workmates.backend.domain.Attachment.TargetType;
import com.workmates.backend.domain.Mail;
import com.workmates.backend.domain.User;
import com.workmates.backend.repository.AddressRepository;
import com.workmates.backend.repository.AttachmentRepository;
import com.workmates.backend.repository.MailRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.web.dto.MailDto.*;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailService {
    
    private final UserRepository userRepository;
    private final MailRepository mailRepository;
    // private final AddressRepository addressRepository;
    private final AttachmentRepository attachmentRepository;
    private final FileUploadService fileUploadService;
    private final SymmetricPasswordEncoder symmetricPasswordEncoder;

    @Async("emailExecutor")
    public CompletableFuture<List<Mail>> refreshMailBox(String id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new IllegalArgumentException("존재하지 않는 사용자입니다.")
        );
        if(user.getEmailPassword() == null) {
            throw new IllegalArgumentException("이메일 서비스 이용을 위해 이메일 비밀번호를 등록해주세요.");
        }
        List<Mail> receivedMails = new ArrayList<>();

        try {
            MailReceiveConfig config = MailReceiveConfig.naverMailImapConfig(user.getEmail(), symmetricPasswordEncoder.decrypt(user.getEmailPassword()));
            Session session = createMailSession(config);

            Store store = session.getStore(config.getProtocol());
            store.connect(config.getHost(), config.getPort(), config.getUsername(), config.getPassword());

            Folder folder = store.getFolder(config.getFolderName());
            folder.open(Folder.READ_ONLY);

            Message[] messages = folder.getMessages();
            for (Message message : messages) {
                try {
                    Mail receivedMail = processMessage(message, id);
                    if (receivedMail != null) {
                        receivedMails.add(receivedMail);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            
            folder.close(false);
            store.close();
        } catch(Exception e) {
            e.printStackTrace();
            throw new IllegalArgumentException("이메일 수신에 실패했습니다.");
        }

        return CompletableFuture.completedFuture(receivedMails);
    }

    public ReadMailResponse readMail(String userId, Long mailId) {
        Mail mail = mailRepository.findByMailIdAndUserId(mailId, userId).orElseThrow(
            () -> new IllegalArgumentException("요청받은 메일을 찾을 수 없거나 권한이 없습니다.")
        );

        List<String> attachments = attachmentRepository.findByTargetTypeAndTargetIdOrderByIdAsc(TargetType.EMAIL, mail.getMailId())
                                        .stream()
                                        .map(attachment -> attachment.getFileUrl())
                                        .toList();
        
        return ReadMailResponse.builder()
                .mail(mail)
                .attachments(attachments)
                .build();
    }

    public Page<MailResponse> getReceivedMailPage(String id, Pageable pageable) {
        String to = userRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."))
                        .getEmail();
        
        return mailRepository.findAllByToOrderByWrittenAtDesc(to, pageable)
                    .map(mail -> MailResponse.builder()
                                    .mailId(mail.getMailId())
                                    .from(mail.getFrom())
                                    .to(mail.getTo())
                                    .subject(mail.getSubject())
                                    .writtenAt(mail.getWrittenAt())
                                    .build());
    }

    public Page<MailResponse> getSentMailPage(String id, Pageable pageable) {   
        String from = userRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."))
                        .getEmail();
        
         return mailRepository.findAllByFromOrderByWrittenAtDesc(from, pageable)
                    .map(mail -> MailResponse.builder()
                                    .mailId(mail.getMailId())
                                    .from(mail.getFrom())
                                    .to(mail.getTo())
                                    .subject(mail.getSubject())
                                    .writtenAt(mail.getWrittenAt())
                                    .build());
    }   

    @Transactional
    public SendMailResponse sendMail(String id, SendMailRequest request) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new IllegalArgumentException("사용자가 존재하지 않습니다.")
        );
        if(user.getEmailPassword() == null) {
            throw new IllegalArgumentException("이메일 서비스 이용을 위해 비밀번호를 등록해주세요.");
        }

        JavaMailSender mailSender = initializeMailSenderByNaverMail(user.getEmail(), symmetricPasswordEncoder.decrypt(user.getEmailPassword()));

        try {
            sendMailSync(mailSender, request);
            
            Mail mail = mailRepository.save(Mail.builder()
                            .from(request.getFrom())
                            .to(request.getTo())
                            .subject(request.getSubject())
                            .content(request.getContent())
                            .userId(id)
                            .build());
            
            if(request.getAttachments() != null && !request.getAttachments().isEmpty()) {
                fileUploadService.uploadFile(request.getAttachments(), id, mail.getMailId());
            }
        } catch(MessagingException e) {
            throw new IllegalArgumentException("메일 전송에 실패했습니다 : " + e.getMessage());
        }
        
        return SendMailResponse.builder()
                .isMailSent(true)
                .build();
    }

    // public GetAddressListResponse getAddressList(String id) {
    //     List<Address> addressList = addressRepository.findAllById(id);
        
    //     return GetAddressListResponse.builder()
    //             .addressList(addressList)
    //             .build();
    // }

    // @Transactional
    // public AppendAddressResponse appendAddress(String id, AppendAddressRequest request) {
    //     String email = request.getEmail();
    //     String alias = request.getAlias();
        
    //     if(!ServiceUtil.validateEmail(email)) {
    //         throw new IllegalArgumentException("이메일 주소가 올바르지 않습니다.");
    //     }
    //     if(!ServiceUtil.validateNickname(alias)) {
    //         throw new IllegalArgumentException("별명이 올바르지 않습니다.");
    //     }

    //     AddressId addressId = new AddressId(id, email);
    //     Optional<Address> address = addressRepository.findById(addressId);

    //     if(address.isPresent()) {
    //         throw new IllegalArgumentException("이미 주소록에 등록된 이메일 주소입니다.");
    //     }

    //     Address addressEntity = Address.builder()
    //                                 .id(id)
    //                                 .email(email)
    //                                 .alias(alias)
    //                                 .build();
    //     addressRepository.save(addressEntity);

    //     return AppendAddressResponse.builder()
    //             .isAppended(true)
    //             .build();
    // }

    // @Transactional
    // public UpdateAddressResponse updateAddress(String id, UpdateAddressRequest request) {
    //     String email = request.getEmail();
    //     String alias = request.getAlias();
        
    //     if(!ServiceUtil.validateEmail(email)) {
    //         throw new IllegalArgumentException("이메일 주소가 올바르지 않습니다.");
    //     }
    //     if(!ServiceUtil.validateNickname(alias)) {
    //         throw new IllegalArgumentException("별명이 올바르지 않습니다.");
    //     }

    //     AddressId addressId = new AddressId(id, email);
    //     Optional<Address> address = addressRepository.findById(addressId);

    //     if(!address.isPresent()) {
    //         throw new IllegalArgumentException("일치하는 이메일 주소가 없습니다.");
    //     }

    //     Address addressEntity = address.get();
        
    //     if(request.getDeleteAddress()) {
    //         addressRepository.delete(addressEntity);
            
    //         return UpdateAddressResponse.builder()
    //                     .result(2)
    //                     .build();
    //     }

    //     addressEntity.setAlias(alias);

    //     return UpdateAddressResponse.builder()
    //                 .result(1)
    //                 .build();
    // }

    private JavaMailSender initializeMailSenderByGmail(String username, String password) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        mailSender.setDefaultEncoding("UTF-8");

        Properties mailProperties = new Properties();

        mailProperties.setProperty("mail.transport.protocol", "smtp");
        mailProperties.setProperty("mail.smtp.ssl.trust", "smtp.gmail.com");
        mailProperties.setProperty("mail.smtp.auth", String.valueOf(true));
        mailProperties.setProperty("mail.smtp.starttls.enable", String.valueOf(true));
        mailProperties.setProperty("mail.smtp.starttls.required", String.valueOf(true));
        mailProperties.setProperty("mail.smtp.connectiontimeout", String.valueOf(5000));
        mailProperties.setProperty("mail.smtp.timeout", String.valueOf(5000));
        mailProperties.setProperty("mail.mime.charset", "UTF-8");

        mailSender.setJavaMailProperties(mailProperties);

        return mailSender;
    }

    private JavaMailSender initializeMailSenderByNaverMail(String username, String password) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost("smtp.naver.com");
        mailSender.setPort(587);
        mailSender.setUsername(username);
        mailSender.setPassword(password);
        mailSender.setDefaultEncoding("UTF-8");

        Properties mailProperties = new Properties();

        mailProperties.setProperty("mail.transport.protocol", "smtp");
        mailProperties.setProperty("mail.smtp.ssl.trust", "smtp.naver.com");
        mailProperties.setProperty("mail.smtp.auth", String.valueOf(true));
        mailProperties.setProperty("mail.smtp.starttls.enable", String.valueOf(true));
        mailProperties.setProperty("mail.smtp.starttls.required", String.valueOf(true));
        mailProperties.setProperty("mail.smtp.connectiontimeout", String.valueOf(5000));
        mailProperties.setProperty("mail.smtp.timeout", String.valueOf(5000));
        mailProperties.setProperty("mail.mime.charset", "UTF-8");

        mailSender.setJavaMailProperties(mailProperties);

        return mailSender;
    }

    private void sendMailSync(JavaMailSender mailSender, SendMailRequest request) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper;
        List<MultipartFile> files = request.getAttachments();

        helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(request.getFrom());
        helper.setTo(request.getTo());
        helper.setSubject(request.getSubject());
        helper.setText(request.getContent());

        if(files != null && !files.isEmpty()) {
            for(MultipartFile file : files) {
                if(file != null && !file.isEmpty()) {
                    helper.addAttachment(file.getOriginalFilename(), file);
                }
            }
        }

        mailSender.send(message);
    }

    private Session createMailSession(MailReceiveConfig config) {
        Properties props = new Properties();
        
        if ("imap".equals(config.getProtocol())) {
            props.put("mail.store.protocol", "imap");
            props.put("mail.imap.host", config.getHost());
            props.put("mail.imap.port", config.getPort());
            props.put("mail.imap.ssl.enable", config.isSslEnable());
            props.put("mail.imap.starttls.enable", config.isStartTlsEnable());
            props.put("mail.imap.connectiontimeout", config.getConnectionTimeout());
            props.put("mail.imap.timeout", config.getReadTimeout());
        }
        
        return Session.getDefaultInstance(props);
    }

    private Mail processMessage(Message message, String userId) throws Exception {
        String messageId = message.getHeader("Message-ID") != null 
            ? message.getHeader("Message-ID")[0] : null;
            
        if (messageId != null && mailRepository.existsByMessageId(messageId)) {
            return null;
        }
        
        String fromEmail = extractEmail(message.getFrom());
        String toEmail = extractEmail(message.getRecipients(Message.RecipientType.TO));
        String subject = message.getSubject();
        Date sentDate = message.getSentDate();
        String textContent = extractContent(message);
        
        Mail receivedMail = mailRepository.save(Mail.builder()
                                .messageId(messageId)
                                .from(fromEmail)
                                .to(toEmail)
                                .subject(subject)
                                .content(textContent)
                                .writtenAt(sentDate.toInstant().atZone(ZoneId.of("Asia/Seoul")).toLocalDateTime())
                                .userId(userId)
                                .build());
 
        processAttachments(message, receivedMail);

        return receivedMail;
    }
    
    private String extractEmail(Address[] addresses) {
        if (addresses != null && addresses.length > 0) {
            return ((InternetAddress) addresses[0]).getAddress();
        }
        return "";
    }
    
    private String extractContent(Message message) throws Exception {
        String textContent = "";
        
        if (message.isMimeType("text/plain")) {
            textContent = (String) message.getContent();
        } else if (message.isMimeType("multipart/*")) {
            MimeMultipart multipart = (MimeMultipart) message.getContent();
            
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart bodyPart = multipart.getBodyPart(i);
                
                if (bodyPart.isMimeType("text/plain") && textContent.isEmpty()) {
                    textContent = (String) bodyPart.getContent();
                } 
            }
        }
        
        return textContent;
    }
    
    private List<String> processAttachments(Message message, Mail receivedMail) throws Exception {
        List<String> attachments = new ArrayList<>();
        
        if (message.isMimeType("multipart/*")) {
            MimeMultipart multipart = (MimeMultipart) message.getContent();
            
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart bodyPart = multipart.getBodyPart(i);
                
                if (Part.ATTACHMENT.equalsIgnoreCase(bodyPart.getDisposition()) ||
                    StringUtils.hasText(bodyPart.getFileName())) {
                    
                    String url = saveAttachment(bodyPart, receivedMail);
                    if (url != null) {
                        attachments.add(url);
                    }
                }
            }
        }
        
        return attachments;
    }
    
    private String saveAttachment(BodyPart bodyPart, Mail receivedMail) throws Exception {
        String fileName = bodyPart.getFileName();
        if (!StringUtils.hasText(fileName)) {
            return null;
        }

        MultipartFile file = new BodyPartMultipartFile(bodyPart, fileName, fileName);  
        String url = fileUploadService.uploadFile(file, receivedMail.getUserId(), receivedMail.getMailId());

        return url;
    }

    public static class BodyPartMultipartFile implements MultipartFile {
        private final BodyPart bodyPart;
        private final String name;
        private final String originalFilename;

        public BodyPartMultipartFile(BodyPart bodyPart, String name, String originalFilename) {
            this.bodyPart = bodyPart;
            this.name = name;
            this.originalFilename = originalFilename;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public String getOriginalFilename() {
            return originalFilename;
        }

        @Override
        public String getContentType() {
            try {
                return bodyPart.getContentType();
            } catch (MessagingException e) {
                return null;
            }
        }

        @Override
        public boolean isEmpty() {
            try {
                return bodyPart.getSize() == 0;
            } catch (MessagingException e) {
                return true;
            }
        }

        @Override
        public long getSize() {
            try {
                return bodyPart.getSize();
            } catch (MessagingException e) {
                return 0;
            }
        }

        @Override
        public byte[] getBytes() throws IOException {
            try (InputStream inputStream = bodyPart.getInputStream();
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
                return outputStream.toByteArray();
            } catch (MessagingException e) {
                throw new IOException("Error reading BodyPart", e);
            }
        }

        @Override
        public InputStream getInputStream() throws IOException {
            try {
                return bodyPart.getInputStream();
            } catch (MessagingException e) {
                throw new IOException("Error getting InputStream from BodyPart", e);
            }
        }

        @Override
        public void transferTo(File dest) throws IOException, IllegalStateException {
            try (InputStream inputStream = getInputStream();
                FileOutputStream outputStream = new FileOutputStream(dest)) {
                
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    outputStream.write(buffer, 0, bytesRead);
                }
            }
        }
    }
}

