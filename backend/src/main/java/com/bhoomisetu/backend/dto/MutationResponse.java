package com.bhoomisetu.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MutationResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String applicantName;
    private String reason;
    private String newOwnerName;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
}
