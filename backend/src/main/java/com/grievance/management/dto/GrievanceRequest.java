package com.grievance.management.dto;

import com.grievance.management.enums.GrievanceCategory;
import com.grievance.management.enums.GrievanceType;
import lombok.Data;

@Data
public class GrievanceRequest {
    private String title;
    private String description;
    private GrievanceCategory category;
    private GrievanceType type;
    private Long departmentId;
}
