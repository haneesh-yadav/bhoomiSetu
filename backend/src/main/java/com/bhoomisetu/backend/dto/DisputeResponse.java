package com.bhoomisetu.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DisputeResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String filerName;
    private String caseNumber;
    private String description;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
}
