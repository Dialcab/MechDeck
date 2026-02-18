package com.example.MechDeck.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Choice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String choiceText;

    @Column(name = "is_correct")
    private boolean correct;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;
}

