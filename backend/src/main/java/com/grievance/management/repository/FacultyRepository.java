package com.grievance.management.repository;

import com.grievance.management.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByUserId(Long userId);
    Optional<Faculty> findByEmployeeId(String employeeId);
    List<Faculty> findByCollegeId(Long collegeId);
    List<Faculty> findByDepartmentId(Long departmentId);
    List<Faculty> findByCollegeIdAndIsGrievanceResolver(Long collegeId, boolean isGrievanceResolver);
    boolean existsByEmployeeId(String employeeId);
}
