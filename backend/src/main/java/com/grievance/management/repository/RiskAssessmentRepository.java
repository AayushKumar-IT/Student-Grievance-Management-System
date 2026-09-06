package com.grievance.management.repository;

import com.grievance.management.entity.RiskAssessment;
import com.grievance.management.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    Optional<RiskAssessment> findByGrievanceId(Long grievanceId);
    List<RiskAssessment> findByRiskLevel(RiskLevel riskLevel);
    List<RiskAssessment> findByRequiresImmediateActionTrue();
}
