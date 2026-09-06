package com.grievance.management.service;

import com.grievance.management.entity.Faculty;
import com.grievance.management.entity.Grievance;
import com.grievance.management.enums.GrievanceStatus;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.FacultyRepository;
import com.grievance.management.repository.GrievanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final GrievanceRepository grievanceRepository;
    private final FacultyRepository facultyRepository;

    public Grievance assignGrievance(Long grievanceId, Long facultyId) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found with id: " + grievanceId));
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + facultyId));

        grievance.setAssignedFaculty(faculty);
        grievance.setStatus(GrievanceStatus.ASSIGNED);
        return grievanceRepository.save(grievance);
    }

    public Grievance autoAssign(Long grievanceId) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found"));

        // Find available resolver in the same college/department
        facultyRepository.findByCollegeIdAndIsGrievanceResolver(
                grievance.getCollege().getId(), true)
                .stream().findFirst()
                .ifPresent(faculty -> {
                    grievance.setAssignedFaculty(faculty);
                    grievance.setStatus(GrievanceStatus.ASSIGNED);
                });

        return grievanceRepository.save(grievance);
    }
}
