package com.grievance.management.controller;

import com.grievance.management.entity.Evidence;
import com.grievance.management.service.EvidenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@RequiredArgsConstructor
public class EvidenceController {

    private final EvidenceService evidenceService;

    @PostMapping("/grievance/{grievanceId}")
    public ResponseEntity<List<Evidence>> uploadEvidence(
            @PathVariable Long grievanceId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(evidenceService.uploadEvidence(grievanceId, files));
    }

    @GetMapping("/grievance/{grievanceId}")
    public ResponseEntity<List<Evidence>> getEvidenceByGrievance(@PathVariable Long grievanceId) {
        return ResponseEntity.ok(evidenceService.getEvidenceByGrievance(grievanceId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadEvidence(@PathVariable Long id) {
        return evidenceService.downloadEvidence(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvidence(@PathVariable Long id) {
        evidenceService.deleteEvidence(id);
        return ResponseEntity.noContent().build();
    }
}
