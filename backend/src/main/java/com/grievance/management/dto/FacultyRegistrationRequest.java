package com.grievance.management.dto;

import lombok.Data;

@Data
public class FacultyRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String employeeId;
    private String phoneNumber;
    private Long collegeId;
    private Long departmentId;
    private String designation;
    private String registrationToken;
}
