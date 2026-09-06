package com.grievance.management.repository;

import com.grievance.management.entity.Grievance;
import com.grievance.management.enums.GrievanceCategory;
import com.grievance.management.enums.GrievanceStatus;
import com.grievance.management.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    List<Grievance> findByStudentId(Long studentId);
    List<Grievance> findByCollegeId(Long collegeId);
    List<Grievance> findByAssignedFacultyId(Long facultyId);
    List<Grievance> findByStatus(GrievanceStatus status);
    List<Grievance> findByCollegeIdAndStatus(Long collegeId, GrievanceStatus status);
    List<Grievance> findByCollegeIdAndCategory(Long collegeId, GrievanceCategory category);
    List<Grievance> findByPriority(Priority priority);
    List<Grievance> findByIsDuplicateTrue();
    long countByCollegeId(Long collegeId);
    long countByCollegeIdAndStatus(Long collegeId, GrievanceStatus status);
}
