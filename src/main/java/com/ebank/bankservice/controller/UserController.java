package com.ebank.bankservice.controller;

import com.ebank.bankservice.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public Map<String, Object> me(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return Map.of(
                "username", userDetails.getUsername(),
                "firstLogin", userDetails.isFirstLogin(),
                "roles", userDetails.getAuthorities()
        );
    }
}
