package com.ebank.bankservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateClientByAgentRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String identityNumber; // RG_4

    @Email
    @NotBlank
    private String email; // RG_6

    // optionnel – par défaut 1234
    private String tempPassword;
}
