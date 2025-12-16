package com.ebank.bankservice.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final String username;
    private final String password;
    private final boolean firstLogin;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(
            String username,
            String password,
            boolean firstLogin,
            Collection<? extends GrantedAuthority> authorities
    ) {
        this.username = username;
        this.password = password;
        this.firstLogin = firstLogin;
        this.authorities = authorities;
    }

    public boolean isFirstLogin() {
        return firstLogin;
    }

    // ✅ NOUVEAU – utile partout
    public boolean hasRole(String role) {
        return authorities.stream()
                .anyMatch(a -> a.getAuthority().equals(role));
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return username; }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
