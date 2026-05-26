package com.bhoomisetu.backend.dto;

import lombok.Data;

@Data
public class MutationRequest {
    private Long propertyId;
    private String reason;         // "Inheritance", "Name Correction", etc.
    private String newOwnerName;
    private String supportingDoc;  // placeholder for document reference
}
