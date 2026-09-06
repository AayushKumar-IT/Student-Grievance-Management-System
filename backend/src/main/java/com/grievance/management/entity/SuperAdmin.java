package com.grievance.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "super_admins")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuperAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String phoneNumber;
}
