package com.grievance.management.dto;

import com.grievance.management.enums.GrievanceCategory;
import com.grievance.management.enums.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResponse {
    private GrievanceCategory predictedCategory;
    private Double categoryConfidence;
    private Priority predictedPriority;
    private Double priorityConfidence;
    private Boolean isFakeComplaint;
    private Double fakeConfidence;
    private Boolean isDuplicate;
    private Long duplicateOfId;
    private Double duplicateSimilarityScore;
    private Boolean isAnomaly;
    private Double anomalyScore;
    private String analysisNotes;
}
