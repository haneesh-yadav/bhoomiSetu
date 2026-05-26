package com.bhoomisetu.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String aadhaar;
    private String dob;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String role; // "USER" or "REGISTRAR"
}
