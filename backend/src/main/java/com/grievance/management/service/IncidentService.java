package com.grievance.management.service;

import com.grievance.management.dto.IncidentConfirmationRequest;
import com.grievance.management.entity.*;
import com.grievance.management.enums.VerificationStatus;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentConfirmationRepository confirmationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    private static final int CONFIRMATION_THRESHOLD = 3;

    public Incident reportIncident(Long grievanceId, String description, java.time.LocalDateTime incidentDate) {
        // Incident should be linked to a Grievance — fetched from caller
        throw new UnsupportedOperationException("Use overloaded method with Grievance entity");
    }

    public IncidentConfirmation confirmIncident(IncidentConfirmationRequest request) {
        Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        IncidentConfirmation confirmation = IncidentConfirmation.builder()
                .incident(incident)
                .student(student)
                .confirmed(request.getConfirmed())
                .comment(request.getComment())
                .build();
        IncidentConfirmation saved = confirmationRepository.save(confirmation);

        updateVerificationStatus(incident);
        return saved;
    }

    private void updateVerificationStatus(Incident incident) {
        long confirmCount = confirmationRepository.countByIncidentIdAndConfirmedTrue(incident.getId());
        incident.setConfirmationCount((int) confirmCount);
        if (confirmCount >= CONFIRMATION_THRESHOLD) {
            incident.setVerificationStatus(VerificationStatus.VERIFIED);
        }
        incidentRepository.save(incident);
    }

    public List<Incident> getIncidentsByGrievance(Long grievanceId) {
        return incidentRepository.findByGrievanceId(grievanceId);
    }
}
