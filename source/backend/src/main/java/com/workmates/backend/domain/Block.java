package com.workmates.backend.domain;

import java.io.Serializable;

import com.workmates.backend.util.DomainUtil;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "BLOCK")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(com.workmates.backend.domain.Block.BlockId.class)
public class Block { // 사용자 차단 여부 - 차단은 구현하면 +@. 안해도 무관
    
    @Id
    @Column(name = "id", length = DomainUtil.ID_MAX_LEN)
    private String id; // 사용자 아이디

    @Id
    @Column(name = "target_id", length = DomainUtil.ID_MAX_LEN)
    private String targetId; // 차단의 대상이 된 사용자 아이디

    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class BlockId implements Serializable {
        private String id;
        private String targetId;
    }
}
