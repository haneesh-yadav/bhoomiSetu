package com.bhoomisetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    
    // Account details needed by the frontend AuthContext
    private String id;
    private String name;
    private String email;
    private String role;
    
    // Registrar details
    private String office;
    private String district;
    private String employeeId;
    private String since;
}
