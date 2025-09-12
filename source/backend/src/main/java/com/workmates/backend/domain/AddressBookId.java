package com.workmates.backend.domain;

import java.io.Serializable;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddressBookId implements Serializable {
    private String id;
    private String email;
}