package com.examportal.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "government_exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String conductingBody;

    @Column(length = 2000)
    private String purpose;

    @Column(nullable = false)
    private String category;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getConductingBody() { return conductingBody; }
    public void setConductingBody(String conductingBody) { this.conductingBody = conductingBody; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
