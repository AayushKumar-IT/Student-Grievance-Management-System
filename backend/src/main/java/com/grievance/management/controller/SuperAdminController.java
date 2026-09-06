package com.grievance.management.controller;

import com.grievance.management.entity.College;
import com.grievance.management.service.SuperAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(superAdminService.getDashboardStats());
    }

    @GetMapping("/colleges")
    public ResponseEntity<List<College>> getAllColleges() {
        return ResponseEntity.ok(superAdminService.getAllColleges());
    }

    @PostMapping("/colleges")
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        return ResponseEntity.ok(superAdminService.createCollege(college));
    }

    @PutMapping("/colleges/{id}")
    public ResponseEntity<College> updateCollege(@PathVariable Long id, @RequestBody College college) {
        return ResponseEntity.ok(superAdminService.updateCollege(id, college));
    }

    @DeleteMapping("/colleges/{id}")
    public ResponseEntity<Void> deleteCollege(@PathVariable Long id) {
        superAdminService.deleteCollege(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/faculty")
    public ResponseEntity<?> getAllFaculty(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(superAdminService.getFacultyFiltered(collegeId, departmentId));
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(
            @RequestParam(required = false) Long collegeId,
            @RequestParam(required = false) Long departmentId) {
        return ResponseEntity.ok(superAdminService.getStudentsFiltered(collegeId, departmentId));
    }

    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments(@RequestParam(required = false) Long collegeId) {
        return ResponseEntity.ok(superAdminService.getDepartmentsByCollege(collegeId));
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getSystemReports() {
        return ResponseEntity.ok(superAdminService.getSystemReports());
    }
}
