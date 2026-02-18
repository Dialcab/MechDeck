package com.example.MechDeck.auth;

import com.example.MechDeck.dto.*;
import com.example.MechDeck.entity.User;
import com.example.MechDeck.enums.Role;
import com.example.MechDeck.exception.EmailAlreadyRegisteredException;
import com.example.MechDeck.exception.InvalidCredentialsException;
import com.example.MechDeck.repository.UserRepository;
import com.example.MechDeck.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyRegisteredException();
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.STUDENT);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getRole().name());

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String token = jwtService.generateToken(user.getId(), user.getRole().name());

        return new AuthResponse(token);
    }
}
