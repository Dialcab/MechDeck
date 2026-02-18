package com.example.MechDeck.dto;

public record RegisterRequest(
        String name,
        String email,
        String password
) {}