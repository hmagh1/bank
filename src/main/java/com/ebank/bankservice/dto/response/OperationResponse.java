package com.ebank.bankservice.dto.response;

import com.ebank.bankservice.entity.OperationType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class OperationResponse {

    private OperationType type;
    private BigDecimal amount;
    private String sourceAccount;
    private String destinationAccount;
    private LocalDateTime createdAt;
}
