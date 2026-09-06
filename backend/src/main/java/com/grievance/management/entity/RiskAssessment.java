package com.grievance.management.entity;

import com.grievance.management.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "risk_assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grievance_id", nullable = false)
    private Grievance grievance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel;

    private Double riskScore;

    @Column(columnDefinition = "TEXT")
    private String riskFactors;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    private Boolean requiresImmediateAction;

    @Column(nullable = false, updatable = false)
    private LocalDateTime assessedAt;

    @PrePersist
    protected void onCreate() {
        assessedAt = LocalDateTime.now();
    }
}
