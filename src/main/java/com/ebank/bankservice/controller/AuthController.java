package com.ebank.bankservice.controller;

import com.ebank.bankservice.dto.request.*;
import com.ebank.bankservice.security.CustomUserDetails;
import com.ebank.bankservice.security.JwtService;
import com.ebank.bankservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/register-self")
    public ResponseEntity<?> registerSelf(@Valid @RequestBody RegisterSelfRequest request) {
        userService.registerSelf(request);
        return ResponseEntity.ok(Map.of("message", "Client créé avec succès"));
    }

    @PostMapping("/create-client")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<?> createClientByAgent(@Valid @RequestBody CreateClientByAgentRequest request) {
        userService.createClientByAgent(request);
        return ResponseEntity.ok(Map.of("message", "Client créé par l’agent avec succès"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            String token = jwtService.generateToken(userDetails, userDetails.isFirstLogin());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "firstLogin", userDetails.isFirstLogin()
            ));

        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Login ou mot de passe erronés"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@org.springframework.security.core.annotation.AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(Map.of(
                "username", userDetails.getUsername(),
                "firstLogin", userDetails.isFirstLogin(),
                "authorities", userDetails.getAuthorities()
        ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @org.springframework.security.core.annotation.AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(userDetails.getUsername(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Mot de passe changé avec succès"));
    }
}
