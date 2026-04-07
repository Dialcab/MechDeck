package com.example.MechDeck.dto;

import java.util.UUID;

public record SubjectResponse(
        UUID id,
        String code,
        String description
) {}
