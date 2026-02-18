package com.example.MechDeck.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
public class QuizSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;

    private int score;
    private int totalQuestions;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @OneToMany(mappedBy = "quizSession", cascade = CascadeType.ALL)
    private List<UserAnswer> answers;
}

