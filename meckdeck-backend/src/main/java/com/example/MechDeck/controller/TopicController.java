package com.example.MechDeck.controller;

import com.example.MechDeck.dto.DropdownOptionResponse;
import com.example.MechDeck.dto.TopicRequest;
import com.example.MechDeck.dto.TopicResponse;
import com.example.MechDeck.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public List<DropdownOptionResponse> getTopics() {
        return topicService.getTopics();
    }

    @GetMapping("/all")
    public List<TopicResponse> getAllTopics() {
        return topicService.getAllTopics();
    }

    @GetMapping("/{id}")
    public TopicResponse getTopicById(@PathVariable UUID id) {
        return topicService.getTopicById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TopicResponse createTopic(@RequestBody TopicRequest request) {
        return topicService.createTopic(request);
    }

    @PutMapping("/{id}")
    public TopicResponse updateTopic(@PathVariable UUID id, @RequestBody TopicRequest request) {
        return topicService.updateTopic(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTopic(@PathVariable UUID id) {
        topicService.deleteTopic(id);
    }
}
