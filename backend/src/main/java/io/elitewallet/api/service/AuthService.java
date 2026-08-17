package io.elitewallet.api.service;

import io.elitewallet.api.common.NotFoundException;
import io.elitewallet.api.domain.User;
import io.elitewallet.api.domain.UserRepository;
import io.elitewallet.api.dto.AuthDtos.AuthResponse;
import io.elitewallet.api.dto.AuthDtos.LoginRequest;
import io.elitewallet.api.dto.AuthDtos.RegisterRequest;
import io.elitewallet.api.dto.AuthDtos.UserResponse;
import io.elitewallet.api.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LedgerService ledgerService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            LedgerService ledgerService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.ledgerService = ledgerService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(email);
        user.setFullName(request.fullName() == null || request.fullName().isBlank()
                ? email.split("@")[0]
                : request.fullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole("user");
        userRepository.save(user);
        ledgerService.ensureDefaultWallets(user.getId());
        return toAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return toAuthResponse(user);
    }

    public UserResponse me(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return toUserResponse(user);
    }

    private AuthResponse toAuthResponse(User user) {
        String token = jwtService.generate(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole());
    }
}