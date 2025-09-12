package com.workmates.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workmates.backend.config.MailConfig;
import com.workmates.backend.domain.Address;
import com.workmates.backend.domain.Address.*;
import com.workmates.backend.domain.Mail;
import com.workmates.backend.repository.AddressRepository;
import com.workmates.backend.repository.MailRepository;
import com.workmates.backend.repository.UserRepository;
import com.workmates.backend.util.ServiceUtil;
import com.workmates.backend.web.dto.MailDto.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MailService {
    
    private final UserRepository userRepository;
    private final MailRepository mailRepository;
    private final AddressRepository addressRepository;
    private final ConcurrentHashMap<String, MailConfig> mailConfigCache = new ConcurrentHashMap<>();
    private final FileUploadService fileUploadService;

    public ReadMailResponse readMail(String id, Long mailId) {
        Optional<Mail> mail = mailRepository.findById(mailId);
        if(!mail.isPresent()) {
            throw new IllegalArgumentException("요청받은 메일을 찾을 수 없습니다.");
        }

        Mail mailEntity = mail.get();
        if(!mailEntity.getUserId().equals(id)) {
            throw new IllegalArgumentException("해당 메일에 접근할 수 없습니다.");
        }
        
        return ReadMailResponse.builder().build();
    }

    @Transactional
    public ReceiveMailResponse receiveMail(String id) {
        MailConfig config = mailConfigCache.get(id);

        if(config == null) {

        }
        
        return ReceiveMailResponse.builder().build();
    }

    @Transactional
    public SendMailResponse sendMail(String id, SendMailRequest request) {
        MailConfig config = mailConfigCache.get(id);

        if(config == null) {

        }

        return SendMailResponse.builder().build();
    }

    public GetAddressListResponse getAddressList(String id) {
        List<Address> addressList = addressRepository.findAllById(id);
        
        return GetAddressListResponse.builder()
                .addressList(addressList)
                .build();
    }

    @Transactional
    public AppendAddressResponse appendAddress(String id, AppendAddressRequest request) {
        String email = request.getEmail();
        String alias = request.getAlias();
        
        if(!ServiceUtil.validateEmail(email)) {
            throw new IllegalArgumentException("이메일 주소가 올바르지 않습니다.");
        }
        if(!ServiceUtil.validateNickname(alias)) {
            throw new IllegalArgumentException("별명이 올바르지 않습니다.");
        }

        AddressId addressId = new AddressId(id, email);
        Optional<Address> address = addressRepository.findById(addressId);

        if(address.isPresent()) {
            throw new IllegalArgumentException("이미 주소록에 등록된 이메일 주소입니다.");
        }

        Address addressEntity = Address.builder()
                                    .id(id)
                                    .email(email)
                                    .alias(alias)
                                    .build();
        addressRepository.save(addressEntity);

        return AppendAddressResponse.builder()
                .isAppended(true)
                .build();
    }

    @Transactional
    public UpdateAddressResponse updateAddress(String id, UpdateAddressRequest request) {
        String email = request.getEmail();
        String alias = request.getAlias();
        
        if(!ServiceUtil.validateEmail(email)) {
            throw new IllegalArgumentException("이메일 주소가 올바르지 않습니다.");
        }
        if(!ServiceUtil.validateNickname(alias)) {
            throw new IllegalArgumentException("별명이 올바르지 않습니다.");
        }

        AddressId addressId = new AddressId(id, email);
        Optional<Address> address = addressRepository.findById(addressId);

        if(!address.isPresent()) {
            throw new IllegalArgumentException("일치하는 이메일 주소가 없습니다.");
        }

        Address addressEntity = address.get();
        
        if(request.getDeleteAddress()) {
            addressRepository.delete(addressEntity);
            
            return UpdateAddressResponse.builder()
                        .result(2)
                        .build();
        }

        addressEntity.setAlias(alias);

        return UpdateAddressResponse.builder()
                    .result(1)
                    .build();
    }
}

