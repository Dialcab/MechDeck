package com.example.MechDeck.repository;

import com.example.MechDeck.entity.UserAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserAnswerRepository extends JpaRepository<UserAnswer, UUID> {

    List<UserAnswer> findByQuizSessionId(UUID sessionId);
}
