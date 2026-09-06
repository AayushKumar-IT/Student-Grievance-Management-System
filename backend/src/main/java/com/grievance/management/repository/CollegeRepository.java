package com.grievance.management.repository;

import com.grievance.management.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findByCode(String code);
    Optional<College> findByName(String name);
    boolean existsByCode(String code);
    boolean existsByName(String name);
}
