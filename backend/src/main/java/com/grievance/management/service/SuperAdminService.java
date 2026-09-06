package com.grievance.management.service;

import com.grievance.management.entity.*;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final CollegeRepository collegeRepository;
    private final DepartmentRepository departmentRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final GrievanceRepository grievanceRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getDashboardStats() {
        return Map.of(
                "totalColleges", collegeRepository.count(),
                "totalStudents", studentRepository.count(),
                "totalFaculty", facultyRepository.count(),
                "totalGrievances", grievanceRepository.count()
        );
    }

    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }

    public College createCollege(College college) {
        return collegeRepository.save(college);
    }

    public College updateCollege(Long id, College updatedCollege) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College not found with id: " + id));
        college.setName(updatedCollege.getName());
        college.setAddress(updatedCollege.getAddress());
        college.setCity(updatedCollege.getCity());
        college.setState(updatedCollege.getState());
        college.setEmail(updatedCollege.getEmail());
        college.setPhoneNumber(updatedCollege.getPhoneNumber());
        return collegeRepository.save(college);
    }

    public void deleteCollege(Long id) {
        if (!collegeRepository.existsById(id)) {
            throw new ResourceNotFoundException("College not found with id: " + id);
        }
        collegeRepository.deleteById(id);
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public List<Faculty> getFacultyFiltered(Long collegeId, Long departmentId) {
        if (collegeId != null && departmentId != null)
            return facultyRepository.findByDepartmentId(departmentId);
        if (collegeId != null)
            return facultyRepository.findByCollegeId(collegeId);
        return facultyRepository.findAll();
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> getStudentsFiltered(Long collegeId, Long departmentId) {
        if (collegeId != null && departmentId != null)
            return studentRepository.findByDepartmentId(departmentId);
        if (collegeId != null)
            return studentRepository.findByCollegeId(collegeId);
        return studentRepository.findAll();
    }

    public List<Department> getDepartmentsByCollege(Long collegeId) {
        return departmentRepository.findByCollegeId(collegeId);
    }

    public Map<String, Object> getSystemReports() {
        return Map.of(
                "totalUsers", userRepository.count(),
                "totalColleges", collegeRepository.count(),
                "totalGrievances", grievanceRepository.count(),
                "resolvedGrievances", grievanceRepository.findByStatus(
                        com.grievance.management.enums.GrievanceStatus.RESOLVED).size()
        );
    }
}
