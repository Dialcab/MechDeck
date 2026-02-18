package com.example.MechDeck.dto;

import com.example.MechDeck.enums.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String email,
        Role role,
        LocalDateTime createdAt
) {}
