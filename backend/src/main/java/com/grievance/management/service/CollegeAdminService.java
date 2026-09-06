package com.grievance.management.service;

import com.grievance.management.entity.*;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CollegeAdminService {

    private final CollegeAdminRepository collegeAdminRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final GrievanceRepository grievanceRepository;
    private final AssignmentService assignmentService;

    private CollegeAdmin getCurrentAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return collegeAdminRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin profile not found"));
    }

    public Map<String, Object> getDashboardStats() {
        CollegeAdmin admin = getCurrentAdmin();
        Long collegeId = admin.getCollege().getId();
        return Map.of(
                "totalGrievances", grievanceRepository.countByCollegeId(collegeId),
                "totalStudents", studentRepository.findByCollegeId(collegeId).size(),
                "totalFaculty", facultyRepository.findByCollegeId(collegeId).size()
        );
    }

    public List<Department> getDepartments() {
        CollegeAdmin admin = getCurrentAdmin();
        return departmentRepository.findByCollegeId(admin.getCollege().getId());
    }

    public Department createDepartment(Department department) {
        CollegeAdmin admin = getCurrentAdmin();
        department.setCollege(admin.getCollege());
        return departmentRepository.save(department);
    }

    public List<Faculty> getCollegeFaculty() {
        CollegeAdmin admin = getCurrentAdmin();
        return facultyRepository.findByCollegeId(admin.getCollege().getId());
    }

    public List<Student> getCollegeStudents() {
        CollegeAdmin admin = getCurrentAdmin();
        return studentRepository.findByCollegeId(admin.getCollege().getId());
    }

    public List<Grievance> getCollegeGrievances() {
        CollegeAdmin admin = getCurrentAdmin();
        return grievanceRepository.findByCollegeId(admin.getCollege().getId());
    }

    public Grievance assignGrievance(Long grievanceId, Long facultyId) {
        return assignmentService.assignGrievance(grievanceId, facultyId);
    }
}
