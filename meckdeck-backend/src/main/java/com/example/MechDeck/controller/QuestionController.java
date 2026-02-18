package com.example.MechDeck.controller;

import com.example.MechDeck.dto.QuestionRequest;
import com.example.MechDeck.dto.QuestionResponse;
import com.example.MechDeck.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public List<QuestionResponse> getQuestions(
            @RequestParam(required = false) UUID subjectId,
            @RequestParam(required = false) UUID topicId
    ) {
        return questionService.getQuestions(subjectId, topicId);
    }

    @GetMapping("/{id}")
    public QuestionResponse getQuestionById(@PathVariable UUID id) {
        return questionService.getQuestionById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionResponse createQuestion(@RequestBody QuestionRequest request) {
        return questionService.createQuestion(request);
    }

    @PutMapping("/{id}")
    public QuestionResponse updateQuestion(@PathVariable UUID id, @RequestBody QuestionRequest request) {
        return questionService.updateQuestion(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestion(@PathVariable UUID id) {
        questionService.deleteQuestion(id);
    }
}
