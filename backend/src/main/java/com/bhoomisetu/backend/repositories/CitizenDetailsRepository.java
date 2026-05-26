package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.CitizenDetails;
import com.bhoomisetu.backend.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CitizenDetailsRepository extends JpaRepository<CitizenDetails, Long> {
    Optional<CitizenDetails> findByAccount(Account account);
    Optional<CitizenDetails> findByAadhaar(String aadhaar);
}
