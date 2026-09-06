package com.grievance.management.controller;

import com.grievance.management.entity.Student;
import com.grievance.management.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/college/{collegeId}")
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<Student>> getStudentsByCollege(@PathVariable Long collegeId) {
        return ResponseEntity.ok(studentService.getStudentsByCollege(collegeId));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Student> getMyProfile() {
        return ResponseEntity.ok(studentService.getMyProfile());
    }
}
