package com.ebank.bankservice.service;

import com.ebank.bankservice.dto.response.DashboardResponse;
import com.ebank.bankservice.dto.response.OperationResponse;
import com.ebank.bankservice.entity.Account;
import com.ebank.bankservice.entity.User;
import com.ebank.bankservice.repository.AccountRepository;
import com.ebank.bankservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final OperationService operationService;

    public DashboardResponse getDashboard(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Account> accounts = accountRepository.findByUser(user);

        if (accounts.isEmpty()) {
            throw new RuntimeException("No accounts found");
        }

        Account selectedAccount = accounts.get(0);

        List<OperationResponse> lastOperations =
                operationService.history(
                        selectedAccount.getAccountNumber(),
                        0,
                        10
                ).getContent();

        return DashboardResponse.builder()
                .accounts(accounts)
                .selectedAccount(selectedAccount)
                .operations(lastOperations)
                .build();
    }
}
