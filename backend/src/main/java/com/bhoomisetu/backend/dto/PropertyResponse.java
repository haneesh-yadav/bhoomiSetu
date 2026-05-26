package com.bhoomisetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PropertyResponse {
    private Long id;
    private String title;
    private String type;
    private String area;
    private String address;
    private String district;
    private String state;
    private String pincode;
    private String surveyNo;
    private String marketValue;
    private String status;
    private boolean encumbrance;
    private boolean disputeActive;
    private String hash;
    private Long blockNumber;
    private String lastTransfer;
    private List<PropertyEventDto> timeline;
    private LocalDateTime createdAt;
    private Long ownerId;
    private String ownerName;
    private String ownerEmail;
}
