package com.ebank.bankservice.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendClientCredentials(String email, String username, String password) {
        System.out.println("📧 EMAIL SIMULÉ");
        System.out.println("To: " + email);
        System.out.println("Login: " + username);
        System.out.println("Password: " + password);
    }
}
