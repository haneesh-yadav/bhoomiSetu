package com.bhoomisetu.backend.dto;

import lombok.Data;

@Data
public class DisputeRequest {
    private Long propertyId;
    private String caseNumber;
    private String description;
}
