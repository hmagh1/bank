package com.ebank.bankservice.dto.response;

import com.ebank.bankservice.entity.AccountStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountDashboardResponse {

    private String accountNumber;
    private BigDecimal balance;
    private AccountStatus status;
    private List<OperationMiniResponse> lastOperations;
}
