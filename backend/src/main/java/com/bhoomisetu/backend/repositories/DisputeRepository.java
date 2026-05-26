package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.Dispute;
import com.bhoomisetu.backend.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByFiler(Account filer);
    List<Dispute> findByStatus(String status);
}
