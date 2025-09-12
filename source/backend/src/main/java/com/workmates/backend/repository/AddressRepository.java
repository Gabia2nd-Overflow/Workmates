package com.workmates.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.workmates.backend.domain.Address;
import com.workmates.backend.domain.Address.*;

@Repository
public interface AddressRepository extends JpaRepository<Address, AddressId> {
    
    @Query(value = "SELECT * FROM ADDRESS_BOOK WHERE id = :id", nativeQuery = true)
    List<Address> findAllById(String id);
}
