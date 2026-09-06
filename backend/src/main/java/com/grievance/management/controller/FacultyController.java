package com.grievance.management.controller;

import com.grievance.management.entity.Faculty;
import com.grievance.management.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<Faculty>> getAllFaculty() {
        return ResponseEntity.ok(facultyService.getAllFaculty());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable Long id) {
        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<Faculty>> getFacultyByCollege(@PathVariable Long collegeId) {
        return ResponseEntity.ok(facultyService.getFacultyByCollege(collegeId));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<Faculty> getMyProfile() {
        return ResponseEntity.ok(facultyService.getMyProfile());
    }

    @PatchMapping("/{id}/resolver")
    @PreAuthorize("hasRole('COLLEGE_ADMIN')")
    public ResponseEntity<Faculty> toggleResolverStatus(@PathVariable Long id, @RequestParam boolean isResolver) {
        return ResponseEntity.ok(facultyService.toggleResolverStatus(id, isResolver));
    }
}
