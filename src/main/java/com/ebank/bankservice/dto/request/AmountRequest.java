package com.ebank.bankservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
public class AmountRequest {

    @NotBlank
    private String accountNumber;

    @NotNull
    private BigDecimal amount;
}
