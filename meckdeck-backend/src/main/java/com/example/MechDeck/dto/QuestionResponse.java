package com.example.MechDeck.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record QuestionResponse(
        UUID id,
        String questionText,
        String difficulty,
        String explanation,
        UUID subjectId,
        UUID topicId,
        UUID createdById,
        LocalDateTime createdAt,
        List<ChoiceResponse> choices
) {}
