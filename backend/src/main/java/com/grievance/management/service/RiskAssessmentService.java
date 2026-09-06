package com.grievance.management.service;

import com.grievance.management.dto.RiskAssessmentResponse;
import com.grievance.management.entity.AIAnalysis;
import com.grievance.management.entity.Grievance;
import com.grievance.management.entity.RiskAssessment;
import com.grievance.management.enums.RiskLevel;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.RiskAssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RiskAssessmentService {

    private final RiskAssessmentRepository riskAssessmentRepository;

    public void assessRisk(Grievance grievance, AIAnalysis analysis) {
        double riskScore = calculateRiskScore(analysis);
        RiskLevel riskLevel = determineRiskLevel(riskScore);

        RiskAssessment assessment = RiskAssessment.builder()
                .grievance(grievance)
                .riskLevel(riskLevel)
                .riskScore(riskScore)
                .riskFactors(buildRiskFactors(analysis))
                .recommendations(buildRecommendations(riskLevel))
                .requiresImmediateAction(riskLevel == RiskLevel.CRITICAL || riskLevel == RiskLevel.HIGH)
                .build();

        riskAssessmentRepository.save(assessment);
    }

    public RiskAssessmentResponse getRiskByGrievanceId(Long grievanceId) {
        RiskAssessment assessment = riskAssessmentRepository.findByGrievanceId(grievanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Risk assessment not found for grievance: " + grievanceId));
        return mapToResponse(assessment);
    }

    private double calculateRiskScore(AIAnalysis analysis) {
        double score = 0.0;
        if (Boolean.TRUE.equals(analysis.getIsAnomaly())) score += 40;
        if (Boolean.TRUE.equals(analysis.getIsFakeComplaint())) score -= 20;
        if (analysis.getAnomalyScore() != null) score += analysis.getAnomalyScore() * 30;
        return Math.min(100, Math.max(0, score));
    }

    private RiskLevel determineRiskLevel(double score) {
        if (score >= 75) return RiskLevel.CRITICAL;
        if (score >= 50) return RiskLevel.HIGH;
        if (score >= 25) return RiskLevel.MEDIUM;
        return RiskLevel.LOW;
    }

    private String buildRiskFactors(AIAnalysis analysis) {
        StringBuilder sb = new StringBuilder();
        if (Boolean.TRUE.equals(analysis.getIsAnomaly())) sb.append("Anomalous pattern detected. ");
        if (Boolean.TRUE.equals(analysis.getIsFakeComplaint())) sb.append("Potential fake complaint. ");
        if (Boolean.TRUE.equals(analysis.getIsDuplicate())) sb.append("Duplicate submission. ");
        return sb.toString().trim();
    }

    private String buildRecommendations(RiskLevel level) {
        return switch (level) {
            case CRITICAL -> "Immediate escalation required. Notify college administration and authorities.";
            case HIGH -> "Priority review needed. Assign to senior faculty resolver within 24 hours.";
            case MEDIUM -> "Standard review process. Assign within 48 hours.";
            case LOW -> "Routine handling. Assign within 5 working days.";
        };
    }

    private RiskAssessmentResponse mapToResponse(RiskAssessment r) {
        return RiskAssessmentResponse.builder()
                .riskLevel(r.getRiskLevel())
                .riskScore(r.getRiskScore())
                .riskFactors(r.getRiskFactors())
                .recommendations(r.getRecommendations())
                .requiresImmediateAction(r.getRequiresImmediateAction())
                .build();
    }
}
