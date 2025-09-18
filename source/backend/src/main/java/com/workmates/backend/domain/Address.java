package com.workmates.backend.domain;

import java.io.Serializable;

import com.workmates.backend.util.DomainUtil;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ADDRESS")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(com.workmates.backend.domain.Address.AddressId.class)
public class Address {
    
    @Id
    @Column(name = "id", length = DomainUtil.ID_MAX_LEN)
    private String id; // 사용자 아이디

    @Id
    @Column(name = "email", length = DomainUtil.COMMENT_MAX_LEN)
    private String email; // 사용자가 주소록에 등록할 이메일

    @Column(name = "alias", nullable = false, length = DomainUtil.ID_MAX_LEN)
    private String alias; // 해당 이메일 주소의 별칭

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class AddressId implements Serializable {
        private String id;
        private String email;
    }
}
