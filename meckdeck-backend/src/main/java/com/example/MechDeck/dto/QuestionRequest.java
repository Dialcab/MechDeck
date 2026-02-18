package com.example.MechDeck.dto;

import java.util.List;
import java.util.UUID;

public record QuestionRequest(
        String questionText,
        String difficulty,
        String explanation,
        UUID subjectId,
        UUID topicId,
        UUID createdById,
        List<ChoiceRequest> choices
) {}
