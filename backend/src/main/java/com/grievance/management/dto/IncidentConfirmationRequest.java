package com.grievance.management.dto;

import lombok.Data;

@Data
public class IncidentConfirmationRequest {
    private Long incidentId;
    private Boolean confirmed;
    private String comment;
}
