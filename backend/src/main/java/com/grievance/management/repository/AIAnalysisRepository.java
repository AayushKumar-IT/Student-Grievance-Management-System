package com.grievance.management.repository;

import com.grievance.management.entity.AIAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, Long> {
    Optional<AIAnalysis> findByGrievanceId(Long grievanceId);
}
