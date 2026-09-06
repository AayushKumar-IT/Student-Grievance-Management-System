package com.grievance.management.repository;

import com.grievance.management.entity.IncidentConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentConfirmationRepository extends JpaRepository<IncidentConfirmation, Long> {
    List<IncidentConfirmation> findByIncidentId(Long incidentId);
    Optional<IncidentConfirmation> findByIncidentIdAndStudentId(Long incidentId, Long studentId);
    long countByIncidentIdAndConfirmedTrue(Long incidentId);
}
