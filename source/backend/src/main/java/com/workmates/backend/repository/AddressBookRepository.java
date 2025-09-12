package com.workmates.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.AddressBook;
import com.workmates.backend.domain.AddressBookId;

@Repository
public interface AddressBookRepository extends JpaRepository<AddressBook, AddressBookId> {
    
    @Query(value = "SELECT * FROM ADDRESS_BOOK WHERE id = :id", nativeQuery = true)
    List<AddressBook> findAllById(String id);
}
