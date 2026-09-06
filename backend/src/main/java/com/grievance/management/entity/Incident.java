package com.grievance.management.entity;

import com.grievance.management.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "incidents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grievance_id", nullable = false)
    private Grievance grievance;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String incidentDescription;

    @Column(nullable = false)
    private LocalDateTime incidentDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    @OneToMany(mappedBy = "incident", cascade = CascadeType.ALL)
    private List<IncidentConfirmation> confirmations;

    private Integer confirmationCount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime reportedAt;

    @PrePersist
    protected void onCreate() {
        reportedAt = LocalDateTime.now();
        confirmationCount = 0;
    }
}
