package com.grievance.management.dto;

import lombok.Data;

@Data
public class StudentRegistrationRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String enrollmentNumber;
    private String phoneNumber;
    private Long collegeId;
    private Long departmentId;
    private String year;
    private String section;
    // Students register openly — no token required.
    // Token is only required for Faculty and College Admin.
}
