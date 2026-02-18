package com.example.MechDeck.dto;

import com.example.MechDeck.enums.Role;

public record UpdateUserRequest(
        String name,
        String email,
        String password,
        Role role
) {}
