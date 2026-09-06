package com.grievance.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "college_admins")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CollegeAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(nullable = false)
    private String phoneNumber;
}
