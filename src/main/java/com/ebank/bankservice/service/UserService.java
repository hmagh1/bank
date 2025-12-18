package com.ebank.bankservice.service;

import com.ebank.bankservice.dto.request.CreateClientByAgentRequest;
import com.ebank.bankservice.dto.request.RegisterSelfRequest;
import com.ebank.bankservice.entity.*;
import com.ebank.bankservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // =========================
    // CLIENT SELF REGISTER
    // =========================
    public User registerSelf(RegisterSelfRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByIdentityNumber(request.getIdentityNumber())) {
            throw new RuntimeException("Identity number already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role roleClient = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .username(request.getUsername()) // email de login
                .password(passwordEncoder.encode(request.getPassword()))
                .identityNumber(request.getIdentityNumber())
                .email(request.getEmail())
                .firstLogin(false)
                .roles(Set.of(roleClient))
                .accounts(new HashSet<>())
                .build();

        userRepository.save(user);
        createAccountForClient(user);

        return user;
    }


    // =========================
    // AGENT CREATES CLIENT (UC-2)
    // =========================
    public User createClientByAgent(CreateClientByAgentRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByIdentityNumber(request.getIdentityNumber())) {
            throw new RuntimeException("Identity number already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role roleClient = roleRepository.findByName("ROLE_CLIENT")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        String tempPassword =
                (request.getTempPassword() == null || request.getTempPassword().isBlank())
                        ? "1234"
                        : request.getTempPassword();

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(tempPassword))
                .identityNumber(request.getIdentityNumber())
                .email(request.getEmail())
                .firstLogin(true)
                .roles(Set.of(roleClient))
                .accounts(new HashSet<>())
                .build();

        userRepository.save(user);
        createAccountForClient(user);

        // RG_7 – mail (simulé)
        emailService.sendClientCredentials(
                user.getEmail(),
                user.getUsername(),
                tempPassword
        );

        return user;
    }

    // =========================
    // CHANGE PASSWORD
    // =========================
    public void changePassword(String username, String newPassword) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setFirstLogin(false);

        userRepository.save(user);
    }

    // =========================
    // INTERNAL
    // =========================
    private void createAccountForClient(User user) {

        Account account = Account.builder()
                .accountNumber(generateAccountNumber())
                .balance(BigDecimal.ZERO)
                .status(AccountStatus.OPEN)
                .user(user)
                .build();

        user.getAccounts().add(account);
        accountRepository.save(account);
    }

    private String generateAccountNumber() {
        return "ACC-" + UUID.randomUUID()
                .toString()
                .substring(0, 10)
                .toUpperCase();
    }

    // utilisé par /me
    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    // =========================
// LIST CLIENTS (AGENT)
// =========================
    public Set<User> getAllClients() {
        return new HashSet<>(
                userRepository.findByRoles_Name("ROLE_CLIENT")
        );
    }

}
