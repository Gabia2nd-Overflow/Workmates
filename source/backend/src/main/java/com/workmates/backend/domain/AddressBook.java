package com.workmates.backend.domain;

import com.workmates.backend.util.DomainUtil;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ADDRESS_BOOK")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(AddressBookId.class)
public class AddressBook {
    
    @Id
    @Column(name = "id", length = DomainUtil.ID_MAX_LEN)
    private String id; // 사용자 아이디

    @Id
    @Column(name = "email", length = DomainUtil.COMMENT_MAX_LEN)
    private String email; // 사용자가 주소록에 등록할 이메일

    @Column(name = "alias", nullable = false, length = DomainUtil.ID_MAX_LEN)
    private String alias; // 해당 이메일 주소의 별칭
}
