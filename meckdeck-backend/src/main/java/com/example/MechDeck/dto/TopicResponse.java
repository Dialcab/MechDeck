package com.example.MechDeck.dto;

import java.util.UUID;

public record TopicResponse(
        UUID id,
        String name,
        int weight,
        UUID subjectId
) {}
