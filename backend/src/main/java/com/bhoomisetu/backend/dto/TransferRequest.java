package com.bhoomisetu.backend.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private Long propertyId;
    private String buyerEmail; // Identify buyer by their registered email
    private String remarks;
}
