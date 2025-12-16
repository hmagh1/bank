package com.ebank.bankservice.repository;

import com.ebank.bankservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
    boolean existsByIdentityNumber(String identityNumber);
    boolean existsByEmail(String email);

    // ✅ AJOUT
    List<User> findByRoles_Name(String roleName);
}
