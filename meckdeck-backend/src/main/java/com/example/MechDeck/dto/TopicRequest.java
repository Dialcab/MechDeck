package com.example.MechDeck.dto;

import java.util.UUID;

public record TopicRequest(
        String name,
        int weight,
        UUID subjectId
) {}
