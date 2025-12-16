package com.ebank.bankservice.repository;

import com.ebank.bankservice.entity.Account;
import com.ebank.bankservice.entity.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OperationRepository extends JpaRepository<Operation, Long> {

    // =========================
    // DASHBOARD → 10 dernières opérations
    // =========================
    List<Operation> findTop10BySourceAccountOrDestinationAccountOrderByCreatedAtDesc(
            Account source,
            Account destination
    );

    // =========================
    // HISTORIQUE PAGINÉ
    // =========================
    Page<Operation> findBySourceAccount_AccountNumberOrDestinationAccount_AccountNumberOrderByCreatedAtDesc(
            String sourceAccountNumber,
            String destinationAccountNumber,
            Pageable pageable
    );
}
