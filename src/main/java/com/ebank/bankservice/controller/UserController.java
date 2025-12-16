package com.ebank.bankservice.controller;

import com.ebank.bankservice.entity.User;
import com.ebank.bankservice.security.CustomUserDetails;
import com.ebank.bankservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // =========================
    // CURRENT USER (/me)
    // =========================
    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENT') or hasRole('AGENT')")
    public Map<String, Object> me(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return Map.of(
                "username", userDetails.getUsername(),
                "firstLogin", userDetails.isFirstLogin(),
                "roles", userDetails.getAuthorities()
        );
    }

    // =========================
    // LIST CLIENTS (AGENT ONLY)
    // =========================
    @GetMapping("/clients")
    @PreAuthorize("hasRole('AGENT')")
    public Set<User> listClients() {
        return userService.getAllClients();
    }
}
