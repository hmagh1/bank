package com.ebank.bankservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterSelfRequest {

    @NotBlank
    @Email
    private String username; // = email de connexion

    @NotBlank
    private String password;

    // ✅ CIN obligatoire
    @NotBlank
    private String identityNumber;

    // ✅ email stocké explicitement (même valeur que username)
    @NotBlank
    @Email
    private String email;
}
