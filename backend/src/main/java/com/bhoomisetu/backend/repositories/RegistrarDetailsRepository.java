package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.models.RegistrarDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistrarDetailsRepository extends JpaRepository<RegistrarDetails, Long> {
    Optional<RegistrarDetails> findByAccount(Account account);
}
