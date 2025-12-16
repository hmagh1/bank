package com.ebank.bankservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "operations")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Operation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private OperationType type;

    private BigDecimal amount;

    @ManyToOne
    private Account sourceAccount;

    @ManyToOne
    private Account destinationAccount;

    private LocalDateTime createdAt;
}
