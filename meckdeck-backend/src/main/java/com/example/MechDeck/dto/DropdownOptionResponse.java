package com.example.MechDeck.dto;

import java.util.UUID;

public record DropdownOptionResponse(
        UUID id,
        String name
) {}
