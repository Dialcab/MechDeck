package com.example.MechDeck.repository;

import com.example.MechDeck.entity.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TopicRepository extends JpaRepository<Topic, UUID> {

    List<Topic> findBySubjectId(UUID subjectId);
}
