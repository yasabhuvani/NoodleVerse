package com.noodleverse.service;

import com.noodleverse.dto.AuthRequest;
import com.noodleverse.dto.AuthResponse;
import com.noodleverse.dto.RegisterRequest;
import com.noodleverse.entity.User;
import com.noodleverse.exception.BadRequestException;
import com.noodleverse.exception.ResourceNotFoundException;
import com.noodleverse.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "Login successful");
    }

    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(cleanEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return new AuthResponse(saved.getId(), saved.getName(), saved.getEmail(), "Account registered successfully");
    }

    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }
}
