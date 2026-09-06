package com.grievance.management.service;

import com.grievance.management.entity.College;
import com.grievance.management.entity.RegistrationToken;
import com.grievance.management.enums.Role;
import com.grievance.management.exception.ResourceNotFoundException;
import com.grievance.management.repository.CollegeRepository;
import com.grievance.management.repository.RegistrationTokenRepository;
import com.grievance.management.util.TokenGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final RegistrationTokenRepository tokenRepository;
    private final CollegeRepository collegeRepository;

    public RegistrationToken generateToken(Role role, Long collegeId) {
        College college = null;
        if (collegeId != null) {
            college = collegeRepository.findById(collegeId)
                    .orElseThrow(() -> new ResourceNotFoundException("College not found with id: " + collegeId));
        }

        RegistrationToken token = RegistrationToken.builder()
                .token(TokenGenerator.generateSecureToken())
                .targetRole(role)
                .college(college)
                .used(false)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        return tokenRepository.save(token);
    }

    public List<RegistrationToken> getAllTokens() {
        return tokenRepository.findAll();
    }

    public boolean validateToken(String tokenStr) {
        return tokenRepository.findByToken(tokenStr)
                .map(t -> !t.isUsed() && t.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElse(false);
    }
}
