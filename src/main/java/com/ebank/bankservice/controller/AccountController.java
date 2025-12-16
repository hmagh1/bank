package com.ebank.bankservice.controller;

import com.ebank.bankservice.dto.request.AmountRequest;
import com.ebank.bankservice.dto.request.TransferRequest;
import com.ebank.bankservice.dto.response.OperationResponse;
import com.ebank.bankservice.entity.Account;
import com.ebank.bankservice.security.CustomUserDetails;
import com.ebank.bankservice.service.AccountService;
import com.ebank.bankservice.service.OperationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final OperationService operationService;

    // ======================
    // DEPOSIT (CLIENT + AGENT)
    // ======================
    @PostMapping("/deposit")
    @PreAuthorize("hasRole('CLIENT') or hasRole('AGENT')")
    public Account deposit(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody AmountRequest request
    ) {
        if (user.isFirstLogin()) {
            throw new RuntimeException("Veuillez changer votre mot de passe avant d’accéder aux fonctionnalités");
        }
        return accountService.deposit(request.getAccountNumber(), request.getAmount());
    }

    // ======================
    // WITHDRAW (CLIENT + AGENT)
    // ======================
    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('CLIENT') or hasRole('AGENT')")
    public Account withdraw(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody AmountRequest request
    ) {
        if (user.isFirstLogin()) {
            throw new RuntimeException("Veuillez changer votre mot de passe avant d’accéder aux fonctionnalités");
        }
        return accountService.withdraw(request.getAccountNumber(), request.getAmount());
    }

    // ======================
    // TRANSFER (CLIENT + AGENT)
    // ======================
    @PostMapping("/transfer")
    @PreAuthorize("hasRole('CLIENT') or hasRole('AGENT')")
    public Map<String, String> transfer(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody TransferRequest request
    ) {
        if (user.isFirstLogin()) {
            throw new RuntimeException("Veuillez changer votre mot de passe avant d’accéder aux fonctionnalités");
        }

        accountService.transfer(request.getFromAccount(), request.getToAccount(), request.getAmount());
        return Map.of("message", "Virement effectué avec succès");
    }

    // ======================
    // HISTORY (CLIENT + AGENT) + PAGINATION ✅
    // ======================
    @GetMapping("/{accountNumber}/operations")
    @PreAuthorize("hasRole('CLIENT') or hasRole('AGENT')")
    public Page<OperationResponse> history(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (user.isFirstLogin()) {
            throw new RuntimeException("Veuillez changer votre mot de passe avant d’accéder aux fonctionnalités");
        }
        return operationService.history(accountNumber, page, size);
    }

    // ======================
    // ACCOUNT STATUS (AGENT ONLY)
    // ======================
    @PatchMapping("/{accountNumber}/block")
    @PreAuthorize("hasRole('AGENT')")
    public Account block(@PathVariable String accountNumber) {
        return accountService.block(accountNumber);
    }

    @PatchMapping("/{accountNumber}/unblock")
    @PreAuthorize("hasRole('AGENT')")
    public Account unblock(@PathVariable String accountNumber) {
        return accountService.unblock(accountNumber);
    }

    @PatchMapping("/{accountNumber}/close")
    @PreAuthorize("hasRole('AGENT')")
    public Account close(@PathVariable String accountNumber) {
        return accountService.close(accountNumber);
    }
}
