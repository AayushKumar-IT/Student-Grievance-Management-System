package com.grievance.management.dto;

import com.grievance.management.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Long userId;
}
