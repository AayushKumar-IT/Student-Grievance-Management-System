package com.grievance.management.dto;

import lombok.Data;

@Data
public class AdminRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Long collegeId;
    private String registrationToken;
}
