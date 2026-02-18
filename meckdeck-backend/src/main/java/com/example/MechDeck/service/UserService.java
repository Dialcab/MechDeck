package com.example.MechDeck.service;

import com.example.MechDeck.dto.UpdateUserRequest;
import com.example.MechDeck.dto.UserResponse;
import com.example.MechDeck.entity.User;
import com.example.MechDeck.exception.EmailAlreadyRegisteredException;
import com.example.MechDeck.exception.UserNotFoundException;
import com.example.MechDeck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        return toResponse(user);
    }

    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (hasText(request.email()) && !request.email().equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException();
        }

        if (hasText(request.name())) {
            user.setName(request.name());
        }
        if (hasText(request.email())) {
            user.setEmail(request.email());
        }
        if (hasText(request.password())) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        if (request.role() != null) {
            user.setRole(request.role());
        }

        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        userRepository.delete(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
