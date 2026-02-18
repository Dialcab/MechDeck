package com.example.MechDeck.repository;

import com.example.MechDeck.entity.QuizSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizSessionRepository extends JpaRepository<QuizSession, UUID> {

    List<QuizSession> findByUserId(UUID userId);
}
