package com.ebank.bankservice.controller;

import com.ebank.bankservice.dto.response.DashboardResponse;
import com.ebank.bankservice.security.CustomUserDetails;
import com.ebank.bankservice.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasRole('CLIENT')")
    public DashboardResponse dashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return dashboardService.getDashboard(userDetails.getUsername());
    }
}
