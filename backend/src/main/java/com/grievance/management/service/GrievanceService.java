package com.grievance.management.service;

import com.grievance.management.dto.GrievanceRequest;
import com.grievance.management.dto.GrievanceResponse;
import com.grievance.management.entity.*;
import com.grievance.management.enums.GrievanceStatus;
import com.grievance.management.enums.Priority;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GrievanceService {

    private final GrievanceRepository grievanceRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EvidenceService evidenceService;
    private final AIService aiService;

    @Transactional
    public GrievanceResponse submitGrievance(GrievanceRequest request, List<MultipartFile> files) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Grievance grievance = Grievance.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .type(request.getType())
                .priority(Priority.MEDIUM)
                .status(GrievanceStatus.SUBMITTED)
                .student(student)
                .college(student.getCollege())
                .build();

        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(grievance::setDepartment);
        }

        Grievance saved = grievanceRepository.save(grievance);

        if (files != null && !files.isEmpty()) {
            evidenceService.uploadEvidence(saved.getId(), files);
        }

        // Trigger AI analysis asynchronously
        aiService.analyzeGrievanceAsync(saved.getId());

        return mapToResponse(saved);
    }

    public List<GrievanceResponse> getAllGrievances() {
        return grievanceRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public GrievanceResponse getGrievanceById(Long id) {
        return mapToResponse(grievanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found with id: " + id)));
    }

    public List<GrievanceResponse> getMyGrievances() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return grievanceRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<GrievanceResponse> getAssignedGrievances() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return grievanceRepository.findByAssignedFacultyId(user.getId()).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public GrievanceResponse updateGrievance(Long id, GrievanceRequest request) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found"));
        grievance.setTitle(request.getTitle());
        grievance.setDescription(request.getDescription());
        grievance.setCategory(request.getCategory());
        return mapToResponse(grievanceRepository.save(grievance));
    }

    public GrievanceResponse updateStatus(Long id, String status, String note) {
        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found"));
        grievance.setStatus(GrievanceStatus.valueOf(status.toUpperCase()));
        if (note != null) grievance.setResolutionNote(note);
        if (GrievanceStatus.RESOLVED.name().equals(status.toUpperCase())) {
            grievance.setResolvedAt(java.time.LocalDateTime.now());
        }
        return mapToResponse(grievanceRepository.save(grievance));
    }

    public List<GrievanceResponse> getCommonGrievances() {
        return grievanceRepository.findByIsDuplicateTrue().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    private GrievanceResponse mapToResponse(Grievance g) {
        return GrievanceResponse.builder()
                .id(g.getId())
                .title(g.getTitle())
                .description(g.getDescription())
                .category(g.getCategory())
                .type(g.getType())
                .priority(g.getPriority())
                .status(g.getStatus())
                .studentName(g.getStudent().getUser().getFirstName() + " " + g.getStudent().getUser().getLastName())
                .studentEnrollment(g.getStudent().getEnrollmentNumber())
                .collegeName(g.getCollege().getName())
                .departmentName(g.getDepartment() != null ? g.getDepartment().getName() : null)
                .assignedFacultyName(g.getAssignedFaculty() != null
                        ? g.getAssignedFaculty().getUser().getFirstName() + " " + g.getAssignedFaculty().getUser().getLastName()
                        : null)
                .isDuplicate(g.isDuplicate())
                .duplicateOfId(g.getDuplicateOfId())
                .resolutionNote(g.getResolutionNote())
                .submittedAt(g.getSubmittedAt())
                .resolvedAt(g.getResolvedAt())
                .build();
    }
}
