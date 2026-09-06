package com.grievance.management.dto;

import lombok.Data;

@Data
public class LoginRequest {
    /** Standard login: email + password */
    private String email;

    /**
     * Alternative login for students/faculty:
     * supply their college-issued ID (enrollmentNumber or employeeId)
     * instead of email. The backend resolves the email automatically.
     */
    private String collegeId;

    private String password;
}
