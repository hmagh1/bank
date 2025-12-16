package com.ebank.bankservice.dto.response;

import com.ebank.bankservice.entity.Account;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private List<Account> accounts;        // ✅ PAS List<String>
    private Account selectedAccount;
    private List<OperationResponse> operations;
}
