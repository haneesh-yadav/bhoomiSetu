package com.bhoomisetu.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TransferResponse {
    private Long id;
    private Long propertyId;
    private String propertyTitle;
    private String sellerName;
    private String buyerName;
    private String buyerEmail;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
}
