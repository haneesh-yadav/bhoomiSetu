package com.bhoomisetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PropertyRequest {
    private String title;
    private String type; // e.g., "Agricultural", "Residential"
    private String area; // e.g., "1000 sqft"
    private String address;
    private String district;
    private String state;
    private String pincode;
    private String surveyNo;
    private String marketValue;
}
