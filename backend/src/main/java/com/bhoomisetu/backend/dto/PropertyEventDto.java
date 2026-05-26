package com.bhoomisetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PropertyEventDto {
    private Long id;
    private String event;
    private String from;
    private String to;
    private String date;
    private String hash;
    private String status;
}
