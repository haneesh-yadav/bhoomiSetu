package com.bhoomisetu.backend.controllers;

import com.bhoomisetu.backend.dto.AuthResponse;
import com.bhoomisetu.backend.dto.LoginRequest;
import com.bhoomisetu.backend.dto.RegisterRequest;
import com.bhoomisetu.backend.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin // Allows our React frontend to talk to this backend
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody com.bhoomisetu.backend.dto.UpdatePasswordRequest request) {
        try {
            return ResponseEntity.ok(authService.updatePassword(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }
}
