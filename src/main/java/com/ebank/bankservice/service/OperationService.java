package com.ebank.bankservice.service;

import com.ebank.bankservice.dto.response.OperationResponse;
import com.ebank.bankservice.entity.Operation;
import com.ebank.bankservice.repository.OperationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OperationService {

    private final OperationRepository operationRepository;

    public Page<OperationResponse> history(String accountNumber, int page, int size) {

        Pageable pageable = PageRequest.of(
                Math.max(page, 0),
                Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Operation> ops = operationRepository
                .findBySourceAccount_AccountNumberOrDestinationAccount_AccountNumberOrderByCreatedAtDesc(
                        accountNumber,
                        accountNumber,
                        pageable
                );

        return ops.map(op -> OperationResponse.builder()
                .type(op.getType())
                .amount(op.getAmount())
                .sourceAccount(op.getSourceAccount() != null ? op.getSourceAccount().getAccountNumber() : null)
                .destinationAccount(op.getDestinationAccount() != null ? op.getDestinationAccount().getAccountNumber() : null)
                .createdAt(op.getCreatedAt())
                .build());
    }
}
