package com.grievance.management.service;

import com.grievance.management.entity.Grievance;
import com.grievance.management.repository.GrievanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DuplicateDetectionService {

    private final GrievanceRepository grievanceRepository;

    /**
     * Checks if the given grievance is a duplicate of an existing one.
     * Uses simple title/description similarity as a fallback when AI is unavailable.
     */
    public Optional<Long> findDuplicate(Grievance grievance) {
        List<Grievance> existing = grievanceRepository.findByCollegeId(grievance.getCollege().getId());
        for (Grievance g : existing) {
            if (!g.getId().equals(grievance.getId()) && isSimilar(grievance, g)) {
                log.info("Grievance {} detected as duplicate of {}", grievance.getId(), g.getId());
                return Optional.of(g.getId());
            }
        }
        return Optional.empty();
    }

    private boolean isSimilar(Grievance a, Grievance b) {
        if (a.getCategory() != b.getCategory()) return false;
        double titleSim = cosineSimilarity(a.getTitle(), b.getTitle());
        double descSim = cosineSimilarity(a.getDescription(), b.getDescription());
        return (titleSim + descSim) / 2 > 0.8;
    }

    private double cosineSimilarity(String text1, String text2) {
        // Simple word-overlap similarity as a lightweight fallback
        String[] words1 = text1.toLowerCase().split("\\s+");
        String[] words2 = text2.toLowerCase().split("\\s+");
        long common = java.util.Arrays.stream(words1)
                .filter(w -> java.util.Arrays.asList(words2).contains(w)).count();
        return (double) common / Math.max(words1.length, words2.length);
    }
}
