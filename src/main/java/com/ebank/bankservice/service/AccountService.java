package com.ebank.bankservice.service;

import com.ebank.bankservice.entity.*;
import com.ebank.bankservice.repository.AccountRepository;
import com.ebank.bankservice.repository.OperationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final OperationRepository operationRepository;

    // ======================
    // INTERNAL CHECK
    // ======================
    private void checkAccountIsOpen(Account account) {
        if (account.getStatus() != AccountStatus.OPEN) {
            throw new RuntimeException(
                    "Compte " + account.getStatus() + " : opération interdite"
            );
        }
    }

    // ======================
    // DEPOSIT
    // ======================
    public Account deposit(String accountNumber, BigDecimal amount) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        checkAccountIsOpen(account);

        account.setBalance(account.getBalance().add(amount));
        Account saved = accountRepository.save(account);

        operationRepository.save(
                Operation.builder()
                        .type(OperationType.DEPOSIT)
                        .amount(amount)
                        .destinationAccount(saved)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return saved;
    }

    // ======================
    // WITHDRAW
    // ======================
    public Account withdraw(String accountNumber, BigDecimal amount) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant doit être positif");
        }

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        checkAccountIsOpen(account);

        if (account.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        account.setBalance(account.getBalance().subtract(amount));
        Account saved = accountRepository.save(account);

        operationRepository.save(
                Operation.builder()
                        .type(OperationType.WITHDRAW)
                        .amount(amount)
                        .sourceAccount(saved)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        return saved;
    }

    // ======================
    // TRANSFER
    // ======================
    @Transactional
    public void transfer(String fromAccount, String toAccount, BigDecimal amount) {

        if (fromAccount.equals(toAccount)) {
            throw new RuntimeException("Virement vers le même compte interdit");
        }

        Account source = accountRepository.findByAccountNumber(fromAccount)
                .orElseThrow(() -> new RuntimeException("Compte source introuvable"));

        Account destination = accountRepository.findByAccountNumber(toAccount)
                .orElseThrow(() -> new RuntimeException("Compte destination introuvable"));

        checkAccountIsOpen(source);
        checkAccountIsOpen(destination);

        if (source.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Solde insuffisant");
        }

        source.setBalance(source.getBalance().subtract(amount));
        destination.setBalance(destination.getBalance().add(amount));

        accountRepository.save(source);
        accountRepository.save(destination);

        operationRepository.save(
                Operation.builder()
                        .type(OperationType.TRANSFER)
                        .amount(amount)
                        .sourceAccount(source)
                        .destinationAccount(destination)
                        .createdAt(LocalDateTime.now())
                        .build()
        );
    }

    // ======================
    // AGENT ACTIONS
    // ======================

    // 🔒 BLOCK
    public Account block(String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        if (account.getStatus() == AccountStatus.CLOSED) {
            throw new RuntimeException("Impossible de bloquer un compte clôturé");
        }

        account.setStatus(AccountStatus.BLOCKED);
        return accountRepository.save(account);
    }

    // 🔓 UNBLOCK
    public Account unblock(String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        if (account.getStatus() != AccountStatus.BLOCKED) {
            throw new RuntimeException("Seuls les comptes bloqués peuvent être débloqués");
        }

        account.setStatus(AccountStatus.OPEN);
        return accountRepository.save(account);
    }

    // ❌ CLOSE
    public Account close(String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        account.setStatus(AccountStatus.CLOSED);
        return accountRepository.save(account);
    }
}
