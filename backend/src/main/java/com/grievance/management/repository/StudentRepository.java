package com.grievance.management.repository;

import com.grievance.management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByEnrollmentNumber(String enrollmentNumber);
    List<Student> findByCollegeId(Long collegeId);
    List<Student> findByDepartmentId(Long departmentId);
    boolean existsByEnrollmentNumber(String enrollmentNumber);
}
