package com.example.MechDeck.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String code;
    private String description;

    @OneToMany(mappedBy = "subject")
    private List<Topic> topics;

    @OneToMany(mappedBy = "subject")
    private List<Question> questions;
}
