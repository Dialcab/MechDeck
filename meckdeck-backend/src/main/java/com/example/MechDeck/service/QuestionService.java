package com.example.MechDeck.service;

import com.example.MechDeck.dto.ChoiceRequest;
import com.example.MechDeck.dto.ChoiceResponse;
import com.example.MechDeck.dto.QuestionRequest;
import com.example.MechDeck.dto.QuestionResponse;
import com.example.MechDeck.entity.Choice;
import com.example.MechDeck.entity.Question;
import com.example.MechDeck.entity.Subject;
import com.example.MechDeck.entity.Topic;
import com.example.MechDeck.entity.User;
import com.example.MechDeck.exception.ResourceNotFoundException;
import com.example.MechDeck.repository.QuestionRepository;
import com.example.MechDeck.repository.SubjectRepository;
import com.example.MechDeck.repository.TopicRepository;
import com.example.MechDeck.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    public List<QuestionResponse> getQuestions(UUID subjectId, UUID topicId) {
        List<Question> questions;
        if (topicId != null) {
            questions = questionRepository.findByTopicId(topicId);
        } else if (subjectId != null) {
            questions = questionRepository.findBySubjectId(subjectId);
        } else {
            questions = questionRepository.findAll();
        }
        return questions.stream().map(this::toResponse).toList();
    }

    public QuestionResponse getQuestionById(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + id));
        return toResponse(question);
    }

    public QuestionResponse createQuestion(QuestionRequest request) {
        Question question = new Question();
        apply(question, request);
        return toResponse(questionRepository.save(question));
    }

    public QuestionResponse updateQuestion(UUID id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + id));
        apply(question, request);
        return toResponse(questionRepository.save(question));
    }

    public void deleteQuestion(UUID id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + id));
        questionRepository.delete(question);
    }

    private void apply(Question question, QuestionRequest request) {
        question.setQuestionText(request.questionText());
        question.setDifficulty(request.difficulty());
        question.setExplanation(request.explanation());

        Subject subject = null;
        if (request.subjectId() != null) {
            subject = subjectRepository.findById(request.subjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + request.subjectId()));
        }
        question.setSubject(subject);

        Topic topic = null;
        if (request.topicId() != null) {
            topic = topicRepository.findById(request.topicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + request.topicId()));
        }
        question.setTopic(topic);

        User createdBy = null;
        if (request.createdById() != null) {
            createdBy = userRepository.findById(request.createdById())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.createdById()));
        }
        question.setCreatedBy(createdBy);

        List<Choice> newChoices = new ArrayList<>();
        if (request.choices() != null) {
            for (ChoiceRequest choiceRequest : request.choices()) {
                Choice choice = new Choice();
                choice.setChoiceText(choiceRequest.choiceText());
                choice.setCorrect(choiceRequest.correct());
                choice.setQuestion(question);
                newChoices.add(choice);
            }
        }
        if (question.getChoices() == null) {
            question.setChoices(new ArrayList<>());
        }
        question.getChoices().clear();
        question.getChoices().addAll(newChoices);
    }

    private QuestionResponse toResponse(Question question) {
        return new QuestionResponse(
                question.getId(),
                question.getQuestionText(),
                question.getDifficulty(),
                question.getExplanation(),
                question.getSubject() != null ? question.getSubject().getId() : null,
                question.getTopic() != null ? question.getTopic().getId() : null,
                question.getCreatedBy() != null ? question.getCreatedBy().getId() : null,
                question.getCreatedAt(),
                question.getChoices() != null
                        ? question.getChoices().stream()
                        .map(c -> new ChoiceResponse(c.getId(), c.getChoiceText(), c.isCorrect()))
                        .toList()
                        : List.of()
        );
    }
}
