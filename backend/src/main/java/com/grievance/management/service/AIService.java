package com.grievance.management.service;

import com.grievance.management.dto.AIAnalysisResponse;
import com.grievance.management.entity.AIAnalysis;
import com.grievance.management.entity.Grievance;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.AIAnalysisRepository;
import com.grievance.management.repository.GrievanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIService {

    private final AIAnalysisRepository aiAnalysisRepository;
    private final GrievanceRepository grievanceRepository;
    private final RiskAssessmentService riskAssessmentService;
    private final RestTemplate restTemplate;

    private static final String AI_SERVER_URL = "http://localhost:8000";

    public AIAnalysisResponse getAnalysisByGrievanceId(Long grievanceId) {
        AIAnalysis analysis = aiAnalysisRepository.findByGrievanceId(grievanceId)
                .orElseThrow(() -> new ResourceNotFoundException("AI Analysis not found for grievance: " + grievanceId));
        return mapToResponse(analysis);
    }

    public AIAnalysisResponse analyzeGrievance(Long grievanceId) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found"));
        return performAnalysis(grievance);
    }

    @Async
    public void analyzeGrievanceAsync(Long grievanceId) {
        try {
            grievanceRepository.findById(grievanceId).ifPresent(this::performAnalysis);
        } catch (Exception e) {
            log.error("Error during async AI analysis for grievance {}: {}", grievanceId, e.getMessage());
        }
    }

    private AIAnalysisResponse performAnalysis(Grievance grievance) {
        Map<String, String> payload = new HashMap<>();
        payload.put("title", grievance.getTitle());
        payload.put("description", grievance.getDescription());
        payload.put("grievance_id", String.valueOf(grievance.getId()));

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = restTemplate.postForObject(
                    AI_SERVER_URL + "/analyze", payload, Map.class);

            AIAnalysis analysis = buildAnalysisFromResult(grievance, result);
            aiAnalysisRepository.save(analysis);
            riskAssessmentService.assessRisk(grievance, analysis);
            return mapToResponse(analysis);
        } catch (Exception e) {
            log.error("AI server unreachable, using fallback for grievance {}: {}", grievance.getId(), e.getMessage());
            return AIAnalysisResponse.builder().analysisNotes("AI analysis pending").build();
        }
    }

    private AIAnalysis buildAnalysisFromResult(Grievance grievance, Map<String, Object> result) {
        return AIAnalysis.builder()
                .grievance(grievance)
                .categoryConfidence(getDouble(result, "category_confidence"))
                .priorityConfidence(getDouble(result, "priority_confidence"))
                .isFakeComplaint((Boolean) result.getOrDefault("is_fake", false))
                .fakeConfidence(getDouble(result, "fake_confidence"))
                .isDuplicate((Boolean) result.getOrDefault("is_duplicate", false))
                .duplicateOfId(getLong(result, "duplicate_of_id"))
                .duplicateSimilarityScore(getDouble(result, "similarity_score"))
                .isAnomaly((Boolean) result.getOrDefault("is_anomaly", false))
                .anomalyScore(getDouble(result, "anomaly_score"))
                .analysisNotes((String) result.getOrDefault("notes", ""))
                .build();
    }

    private Double getDouble(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? ((Number) val).doubleValue() : null;
    }

    private Long getLong(Map<String, Object> map, String key) {
        Object val = map.get(key);
        return val != null ? ((Number) val).longValue() : null;
    }

    private AIAnalysisResponse mapToResponse(AIAnalysis a) {
        return AIAnalysisResponse.builder()
                .predictedCategory(a.getPredictedCategory())
                .categoryConfidence(a.getCategoryConfidence())
                .predictedPriority(a.getPredictedPriority())
                .priorityConfidence(a.getPriorityConfidence())
                .isFakeComplaint(a.getIsFakeComplaint())
                .fakeConfidence(a.getFakeConfidence())
                .isDuplicate(a.getIsDuplicate())
                .duplicateOfId(a.getDuplicateOfId())
                .duplicateSimilarityScore(a.getDuplicateSimilarityScore())
                .isAnomaly(a.getIsAnomaly())
                .anomalyScore(a.getAnomalyScore())
                .analysisNotes(a.getAnalysisNotes())
                .build();
    }
}
