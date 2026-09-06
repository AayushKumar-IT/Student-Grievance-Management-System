package com.grievance.management.controller;

import com.grievance.management.entity.College;
import com.grievance.management.entity.Department;
import com.grievance.management.repository.CollegeRepository;
import com.grievance.management.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Public APIs used by registration forms.
 *
 * These endpoints do not require authentication.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final CollegeRepository collegeRepository;
    private final DepartmentRepository departmentRepository;

    /**
     * Get all colleges.
     *
     * Only id, name and code are returned.
     * We intentionally do not return the complete College entity
     * because College -> Department -> College can cause recursive JSON.
     */
    @GetMapping("/colleges")
    public ResponseEntity<List<Map<String, Object>>> getAllColleges() {

        List<Map<String, Object>> colleges = collegeRepository.findAll()
                .stream()
                .map(college -> Map.<String, Object>of(
                        "id", college.getId(),
                        "name", college.getName(),
                        "code", college.getCode()
                ))
                .toList();

        return ResponseEntity.ok(colleges);
    }

    /**
     * Get departments belonging to a particular college.
     */
    @GetMapping("/colleges/{collegeId}/departments")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentsByCollege(
            @PathVariable Long collegeId) {

        // Make sure the college exists
        if (!collegeRepository.existsById(collegeId)) {
            return ResponseEntity.notFound().build();
        }

        List<Map<String, Object>> departments = departmentRepository
                .findByCollegeId(collegeId)
                .stream()
                .map(department -> Map.<String, Object>of(
                        "id", department.getId(),
                        "name", department.getName(),
                        "code", department.getCode()
                ))
                .toList();

        return ResponseEntity.ok(departments);
    }
}