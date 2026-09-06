package com.grievance.management.repository;

import com.grievance.management.entity.RegistrationToken;
import com.grievance.management.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationTokenRepository extends JpaRepository<RegistrationToken, Long> {
    Optional<RegistrationToken> findByToken(String token);
    List<RegistrationToken> findByTargetRoleAndUsedFalse(Role role);
    List<RegistrationToken> findByCollegeId(Long collegeId);
    boolean existsByToken(String token);
}
