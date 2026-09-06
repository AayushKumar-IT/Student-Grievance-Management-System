package com.grievance.management.service;

import com.grievance.management.entity.Evidence;
import com.grievance.management.entity.Grievance;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.EvidenceRepository;
import com.grievance.management.repository.GrievanceRepository;
import com.grievance.management.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;
    private final GrievanceRepository grievanceRepository;
    private final FileStorageUtil fileStorageUtil;

    public List<Evidence> uploadEvidence(Long grievanceId, List<MultipartFile> files) {
        Grievance grievance = grievanceRepository.findById(grievanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Grievance not found"));

        List<Evidence> evidences = new ArrayList<>();
        for (MultipartFile file : files) {
            String filePath = fileStorageUtil.storeFile(file, "grievances/" + grievanceId);
            Evidence evidence = Evidence.builder()
                    .grievance(grievance)
                    .fileName(file.getOriginalFilename())
                    .filePath(filePath)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .build();
            evidences.add(evidenceRepository.save(evidence));
        }
        return evidences;
    }

    public List<Evidence> getEvidenceByGrievance(Long grievanceId) {
        return evidenceRepository.findByGrievanceId(grievanceId);
    }

    public ResponseEntity<Resource> downloadEvidence(Long id) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found"));
        Resource resource = fileStorageUtil.loadFileAsResource(evidence.getFilePath());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + evidence.getFileName() + "\"")
                .body(resource);
    }

    public void deleteEvidence(Long id) {
        Evidence evidence = evidenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evidence not found"));
        fileStorageUtil.deleteFile(evidence.getFilePath());
        evidenceRepository.deleteById(id);
    }
}
