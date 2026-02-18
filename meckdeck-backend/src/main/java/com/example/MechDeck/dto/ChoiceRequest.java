package com.example.MechDeck.dto;

public record ChoiceRequest(
        String choiceText,
        boolean correct
) {}
