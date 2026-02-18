package com.example.MechDeck.dto;

import java.util.UUID;

public record ChoiceResponse(
        UUID id,
        String choiceText,
        boolean correct
) {}
