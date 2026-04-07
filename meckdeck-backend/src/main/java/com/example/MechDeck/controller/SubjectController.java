package com.example.MechDeck.controller;

import com.example.MechDeck.dto.DropdownOptionResponse;
import com.example.MechDeck.dto.SubjectRequest;
import com.example.MechDeck.dto.SubjectResponse;
import com.example.MechDeck.service.SubjectService;
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
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@CrossOrigin
public class SubjectController {

    private final SubjectService subjectService;

    @GetMapping
    public List<DropdownOptionResponse> getSubjects() {
        return subjectService.getSubjects();
    }

    @GetMapping("/{id}")
    public SubjectResponse getSubjectById(@PathVariable UUID id) {
        return subjectService.getSubjectById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubjectResponse createSubject(@RequestBody SubjectRequest request) {
        return subjectService.createSubject(request);
    }

    @PutMapping("/{id}")
    public SubjectResponse updateSubject(@PathVariable UUID id, @RequestBody SubjectRequest request) {
        return subjectService.updateSubject(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSubject(@PathVariable UUID id) {
        subjectService.deleteSubject(id);
    }
}
