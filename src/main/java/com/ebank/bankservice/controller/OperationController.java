package com.ebank.bankservice.controller;

import com.ebank.bankservice.dto.response.OperationResponse;
import com.ebank.bankservice.security.CustomUserDetails;
import com.ebank.bankservice.service.OperationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
public class OperationController {

    private final OperationService operationService;

    // =========================
    // HISTORIQUE DES OPERATIONS (CLIENT + AGENT) AVEC PAGINATION
    // =========================
    @GetMapping("/{accountNumber}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('AGENT')")
    public Page<OperationResponse> history(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        if (user.isFirstLogin()) {
            throw new RuntimeException(
                    "Veuillez changer votre mot de passe avant d’accéder aux fonctionnalités"
            );
        }

        return operationService.history(accountNumber, page, size);
    }
}
