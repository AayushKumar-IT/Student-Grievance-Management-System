package com.grievance.management.controller;

import com.grievance.management.dto.GrievanceRequest;
import com.grievance.management.dto.GrievanceResponse;
import com.grievance.management.service.GrievanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/grievances")
@RequiredArgsConstructor
public class GrievanceController {

    private final GrievanceService grievanceService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<GrievanceResponse> submitGrievance(
            @RequestPart("grievance") GrievanceRequest request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        return ResponseEntity.ok(grievanceService.submitGrievance(request, files));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<GrievanceResponse>> getAllGrievances() {
        return ResponseEntity.ok(grievanceService.getAllGrievances());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GrievanceResponse> getGrievanceById(@PathVariable Long id) {
        return ResponseEntity.ok(grievanceService.getGrievanceById(id));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<GrievanceResponse>> getMyGrievances() {
        return ResponseEntity.ok(grievanceService.getMyGrievances());
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('FACULTY')")
    public ResponseEntity<List<GrievanceResponse>> getAssignedGrievances() {
        return ResponseEntity.ok(grievanceService.getAssignedGrievances());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<GrievanceResponse> updateGrievance(@PathVariable Long id, @RequestBody GrievanceRequest request) {
        return ResponseEntity.ok(grievanceService.updateGrievance(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('FACULTY', 'COLLEGE_ADMIN')")
    public ResponseEntity<GrievanceResponse> updateStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String note) {
        return ResponseEntity.ok(grievanceService.updateStatus(id, status, note));
    }

    @GetMapping("/common")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<GrievanceResponse>> getCommonGrievances() {
        return ResponseEntity.ok(grievanceService.getCommonGrievances());
    }
}
