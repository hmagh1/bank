package com.ebank.bankservice.dto.response;

import com.ebank.bankservice.entity.AccountStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountResponse {

    private String accountNumber;
    private BigDecimal balance;
    private AccountStatus status;
}
