package com.grievance.management.repository;

import com.grievance.management.entity.CollegeAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollegeAdminRepository extends JpaRepository<CollegeAdmin, Long> {
    Optional<CollegeAdmin> findByUserId(Long userId);
    List<CollegeAdmin> findByCollegeId(Long collegeId);
}
