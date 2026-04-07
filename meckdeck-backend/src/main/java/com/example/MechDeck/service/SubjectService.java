package com.example.MechDeck.service;

import com.example.MechDeck.dto.DropdownOptionResponse;
import com.example.MechDeck.dto.SubjectRequest;
import com.example.MechDeck.dto.SubjectResponse;
import com.example.MechDeck.entity.Subject;
import com.example.MechDeck.exception.ResourceNotFoundException;
import com.example.MechDeck.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public List<DropdownOptionResponse> getSubjects() {
        return subjectRepository.findAll().stream()
                .sorted(Comparator.comparing(this::subjectName, String.CASE_INSENSITIVE_ORDER))
                .map(subject -> new DropdownOptionResponse(subject.getId(), subjectName(subject)))
                .toList();
    }

    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .sorted(Comparator.comparing(this::subjectName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    public SubjectResponse getSubjectById(UUID id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + id));
        return toResponse(subject);
    }

    public SubjectResponse createSubject(SubjectRequest request) {
        Subject subject = new Subject();
        apply(subject, request);
        return toResponse(subjectRepository.save(subject));
    }

    public SubjectResponse updateSubject(UUID id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + id));
        apply(subject, request);
        return toResponse(subjectRepository.save(subject));
    }

    public void deleteSubject(UUID id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + id));
        subjectRepository.delete(subject);
    }

    private void apply(Subject subject, SubjectRequest request) {
        subject.setCode(request.code());
        subject.setDescription(request.description());
    }

    private SubjectResponse toResponse(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getCode(),
                subject.getDescription()
        );
    }

    private String subjectName(Subject subject) {
        if (hasText(subject.getDescription())) {
            return subject.getDescription().trim();
        }
        if (hasText(subject.getCode())) {
            return subject.getCode().trim();
        }
        return "";
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
