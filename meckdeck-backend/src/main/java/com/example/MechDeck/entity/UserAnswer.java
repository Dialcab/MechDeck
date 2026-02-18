package com.example.MechDeck.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class UserAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private boolean isCorrect;
    private LocalDateTime answeredAt;

    @ManyToOne
    @JoinColumn(name = "quiz_session_id")
    private QuizSession quizSession;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "selected_choice_id")
    private Choice selectedChoice;
}

