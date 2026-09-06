package com.grievance.management.repository;

import com.grievance.management.entity.Incident;
import com.grievance.management.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByGrievanceId(Long grievanceId);
    List<Incident> findByVerificationStatus(VerificationStatus status);
}
