package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    
    // Spring Data JPA is magic! Just by naming this method, 
    // it automatically writes the SQL: SELECT * FROM users WHERE email = ?
    Optional<Account> findByEmail(String email);
    Optional<Account> findByName(String name);
}
