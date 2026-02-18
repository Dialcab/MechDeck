package com.example.MechDeck.dto;

public record LoginRequest(
        String email,
        String password
) {}