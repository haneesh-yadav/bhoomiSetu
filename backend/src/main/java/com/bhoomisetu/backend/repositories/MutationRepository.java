package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.Mutation;
import com.bhoomisetu.backend.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MutationRepository extends JpaRepository<Mutation, Long> {
    List<Mutation> findByApplicant(Account applicant);
    List<Mutation> findByStatus(String status);
}
