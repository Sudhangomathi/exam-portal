package com.examportal.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "engineering_branches")
public class EngineeringBranch {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String shortName;

    @Column(length = 2000)
    private String description;

    private Integer durationInYears;

    public Integer getDurationInYears() { return durationInYears; }
    public void setDurationInYears(Integer durationInYears) { this.durationInYears = durationInYears; }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "branch_exams",
        joinColumns = @JoinColumn(name = "branch_id"),
        inverseJoinColumns = @JoinColumn(name = "exam_id")
    )
    private Set<Exam> exams = new HashSet<>();

    public Set<Exam> getExams() { return exams; }
    public void setExams(Set<Exam> exams) { this.exams = exams; }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
