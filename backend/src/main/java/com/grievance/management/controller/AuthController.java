package com.grievance.management.controller;

import com.grievance.management.dto.*;
import com.grievance.management.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * First-time setup — creates the Super Admin account.
     * Blocked by the service if a super admin already exists.
     */
    @PostMapping("/setup")
    public ResponseEntity<LoginResponse> setupSuperAdmin(@RequestBody SuperAdminSetupRequest request) {
        return ResponseEntity.ok(authService.setupSuperAdmin(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register/student")
    public ResponseEntity<LoginResponse> registerStudent(@RequestBody StudentRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }

    @PostMapping("/register/faculty")
    public ResponseEntity<LoginResponse> registerFaculty(@RequestBody FacultyRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerFaculty(request));
    }

    @PostMapping("/register/college-admin")
    public ResponseEntity<LoginResponse> registerCollegeAdmin(@RequestBody AdminRegistrationRequest request) {
        return ResponseEntity.ok(authService.registerCollegeAdmin(request));
    }
}
