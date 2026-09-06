package com.grievance.management.dto;

import com.grievance.management.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskAssessmentResponse {
    private RiskLevel riskLevel;
    private Double riskScore;
    private String riskFactors;
    private String recommendations;
    private Boolean requiresImmediateAction;
}
