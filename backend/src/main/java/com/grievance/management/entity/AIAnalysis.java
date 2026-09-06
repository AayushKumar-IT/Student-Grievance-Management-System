package com.grievance.management.entity;

import com.grievance.management.enums.GrievanceCategory;
import com.grievance.management.enums.Priority;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grievance_id", nullable = false)
    private Grievance grievance;

    @Enumerated(EnumType.STRING)
    private GrievanceCategory predictedCategory;

    private Double categoryConfidence;

    @Enumerated(EnumType.STRING)
    private Priority predictedPriority;

    private Double priorityConfidence;

    private Boolean isFakeComplaint;

    private Double fakeConfidence;

    private Boolean isDuplicate;

    private Long duplicateOfId;

    private Double duplicateSimilarityScore;

    private Boolean isAnomaly;

    private Double anomalyScore;

    @Column(columnDefinition = "TEXT")
    private String analysisNotes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime analyzedAt;

    @PrePersist
    protected void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}
