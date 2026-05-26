package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.Transfer;
import com.bhoomisetu.backend.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findBySellerOrBuyer(Account seller, Account buyer);
    List<Transfer> findByStatus(String status);
}
