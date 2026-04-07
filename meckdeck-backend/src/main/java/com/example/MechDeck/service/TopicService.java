package com.example.MechDeck.service;

import com.example.MechDeck.dto.DropdownOptionResponse;
import com.example.MechDeck.dto.TopicRequest;
import com.example.MechDeck.dto.TopicResponse;
import com.example.MechDeck.entity.Subject;
import com.example.MechDeck.entity.Topic;
import com.example.MechDeck.exception.ResourceNotFoundException;
import com.example.MechDeck.repository.SubjectRepository;
import com.example.MechDeck.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;
    private final SubjectRepository subjectRepository;

    public List<DropdownOptionResponse> getTopics() {
        return topicRepository.findAll().stream()
                .sorted(Comparator.comparing(Topic::getName, String.CASE_INSENSITIVE_ORDER))
                .map(topic -> new DropdownOptionResponse(topic.getId(), topic.getName()))
                .toList();
    }

    public TopicResponse getTopicById(UUID id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + id));
        return toResponse(topic);
    }

    public TopicResponse createTopic(TopicRequest request) {
        Topic topic = new Topic();
        apply(topic, request);
        return toResponse(topicRepository.save(topic));
    }

    public TopicResponse updateTopic(UUID id, TopicRequest request) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + id));
        apply(topic, request);
        return toResponse(topicRepository.save(topic));
    }

    public void deleteTopic(UUID id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + id));
        topicRepository.delete(topic);
    }

    private void apply(Topic topic, TopicRequest request) {
        topic.setName(request.name());
        topic.setWeight(request.weight());

        Subject subject = null;
        if (request.subjectId() != null) {
            subject = subjectRepository.findById(request.subjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + request.subjectId()));
        }
        topic.setSubject(subject);
    }

    private TopicResponse toResponse(Topic topic) {
        return new TopicResponse(
                topic.getId(),
                topic.getName(),
                topic.getWeight(),
                topic.getSubject() != null ? topic.getSubject().getId() : null
        );
    }
}
