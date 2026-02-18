package com.example.MechDeck.repository;

import com.example.MechDeck.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuestionRepository extends JpaRepository<Question, UUID> {

    List<Question> findBySubjectId(UUID subjectId);

    List<Question> findByTopicId(UUID topicId);
}
