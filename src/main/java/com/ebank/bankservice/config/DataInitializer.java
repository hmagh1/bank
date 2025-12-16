package com.ebank.bankservice.config;

import com.ebank.bankservice.entity.Role;
import com.ebank.bankservice.entity.User;
import com.ebank.bankservice.repository.RoleRepository;
import com.ebank.bankservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository
    ) {
        return args -> {

            // =========================
            // ROLES
            // =========================
            Role clientRole = createRoleIfNotExists(roleRepository, "ROLE_CLIENT");
            Role agentRole  = createRoleIfNotExists(roleRepository, "ROLE_AGENT");
            createRoleIfNotExists(roleRepository, "ROLE_ADMIN");

            // =========================
            // DEFAULT AGENT
            // =========================
            if (!userRepository.existsByUsername("agent@ebank.com")) {

                User agent = User.builder()
                        .username("agent@ebank.com")
                        .password(passwordEncoder.encode("agent1234")) // BCrypt
                        .email("agent@ebank.com")
                        .identityNumber("AGENT-0001")
                        .firstLogin(false)
                        .roles(Set.of(agentRole))
                        .build();

                userRepository.save(agent);

                System.out.println("=====================================");
                System.out.println("✅ DEFAULT AGENT CREATED");
                System.out.println("👉 login    : agent@ebank.com");
                System.out.println("👉 password : agent1234");
                System.out.println("=====================================");
            }
        };
    }

    private Role createRoleIfNotExists(RoleRepository repo, String roleName) {
        return repo.findByName(roleName)
                .orElseGet(() ->
                        repo.save(Role.builder().name(roleName).build())
                );
    }
}
