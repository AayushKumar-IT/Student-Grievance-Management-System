package com.grievance.management.controller;

import com.grievance.management.entity.RegistrationToken;
import com.grievance.management.enums.Role;
import com.grievance.management.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tokens")
@RequiredArgsConstructor
public class TokenController {

    private final TokenService tokenService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<RegistrationToken> generateToken(
            @RequestParam Role role,
            @RequestParam(required = false) Long collegeId) {
        return ResponseEntity.ok(tokenService.generateToken(role, collegeId));
    }

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<RegistrationToken>> getAllTokens() {
        return ResponseEntity.ok(tokenService.getAllTokens());
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        return ResponseEntity.ok(tokenService.validateToken(token));
    }
}
