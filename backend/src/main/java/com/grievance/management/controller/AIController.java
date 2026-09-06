package com.grievance.management.controller;

import com.grievance.management.dto.AIAnalysisResponse;
import com.grievance.management.dto.RiskAssessmentResponse;
import com.grievance.management.service.AIService;
import com.grievance.management.service.RiskAssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;
    private final RiskAssessmentService riskAssessmentService;

    @GetMapping("/analysis/{grievanceId}")
    public ResponseEntity<AIAnalysisResponse> getAnalysis(@PathVariable Long grievanceId) {
        return ResponseEntity.ok(aiService.getAnalysisByGrievanceId(grievanceId));
    }

    @PostMapping("/analyze/{grievanceId}")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<AIAnalysisResponse> triggerAnalysis(@PathVariable Long grievanceId) {
        return ResponseEntity.ok(aiService.analyzeGrievance(grievanceId));
    }

    @GetMapping("/risk/{grievanceId}")
    public ResponseEntity<RiskAssessmentResponse> getRiskAssessment(@PathVariable Long grievanceId) {
        return ResponseEntity.ok(riskAssessmentService.getRiskByGrievanceId(grievanceId));
    }
}
