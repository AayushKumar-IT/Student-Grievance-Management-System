package com.grievance.management.dto;

import com.grievance.management.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GrievanceResponse {
    private Long id;
    private String title;
    private String description;
    private GrievanceCategory category;
    private GrievanceType type;
    private Priority priority;
    private GrievanceStatus status;
    private String studentName;
    private String studentEnrollment;
    private String collegeName;
    private String departmentName;
    private String assignedFacultyName;
    private boolean isDuplicate;
    private Long duplicateOfId;
    private String resolutionNote;
    private LocalDateTime submittedAt;
    private LocalDateTime resolvedAt;
    private AIAnalysisResponse aiAnalysis;
    private RiskAssessmentResponse riskAssessment;
}
