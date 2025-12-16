package com.ebank.bankservice.controller;

import com.ebank.bankservice.dto.request.CreateClientByAgentRequest;
import com.ebank.bankservice.entity.User;
import com.ebank.bankservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {

    private final UserService userService;

    // 👮 AGENT crée un client
    @PostMapping("/clients")
    @PreAuthorize("hasRole('AGENT')")
    public User createClient(@Valid @RequestBody CreateClientByAgentRequest request) {
        return userService.createClientByAgent(request);
    }
}
