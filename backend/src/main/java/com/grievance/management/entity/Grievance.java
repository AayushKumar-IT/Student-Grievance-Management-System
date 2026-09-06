package com.grievance.management.entity;

import com.grievance.management.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "grievances")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrievanceCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrievanceType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GrievanceStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_faculty_id")
    private Faculty assignedFaculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "grievance", cascade = CascadeType.ALL)
    private List<Evidence> evidences;

    @OneToOne(mappedBy = "grievance", cascade = CascadeType.ALL)
    private AIAnalysis aiAnalysis;

    @OneToOne(mappedBy = "grievance", cascade = CascadeType.ALL)
    private RiskAssessment riskAssessment;

    @lombok.Builder.Default
    private boolean isDuplicate = false;

    private Long duplicateOfId;

    private String resolutionNote;

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    private LocalDateTime resolvedAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
