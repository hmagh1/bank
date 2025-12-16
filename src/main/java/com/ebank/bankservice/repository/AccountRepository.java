package com.ebank.bankservice.repository;

import com.ebank.bankservice.entity.Account;
import com.ebank.bankservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    // Déjà utilisé ailleurs
    Optional<Account> findByAccountNumber(String accountNumber);

    // ✅ POUR LE DASHBOARD (TOUS LES COMPTES D’UN CLIENT)
    List<Account> findByUser(User user);
}
