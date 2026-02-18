package com.example.MechDeck.repository;

import com.example.MechDeck.entity.Choice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChoiceRepository extends JpaRepository<Choice, UUID> {

    List<Choice> findByQuestionId(UUID questionId);
}
