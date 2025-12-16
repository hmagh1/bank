package com.ebank.bankservice.dto.response;

import com.ebank.bankservice.entity.OperationType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperationMiniResponse {

    private OperationType type;
    private BigDecimal amount;
    private String label; // ex: "Virement en votre faveur"
    private LocalDateTime createdAt;
}
