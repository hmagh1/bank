package com.ebank.bankservice.service;

import com.ebank.bankservice.dto.request.LoginRequest;
import com.ebank.bankservice.dto.request.RegisterRequest;
import com.ebank.bankservice.dto.response.AuthResponse;
import com.ebank.bankservice.entity.Role;
import com.ebank.bankservice.entity.User;
import com.ebank.bankservice.repository.RoleRepository;
import com.ebank.bankservice.repository.UserRepository;
import com.ebank.bankservice.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Register a new user


    // Login user and return JWT
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT
        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(token);
    }
}
