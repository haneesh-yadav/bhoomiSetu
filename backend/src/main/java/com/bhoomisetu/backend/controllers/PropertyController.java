package com.bhoomisetu.backend.controllers;

import com.bhoomisetu.backend.dto.PropertyRequest;
import com.bhoomisetu.backend.dto.PropertyResponse;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.services.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@RequiredArgsConstructor
@CrossOrigin
public class PropertyController {

    private final PropertyService propertyService;

    // The @AuthenticationPrincipal magically injects the currently logged-in user!
    
    @PostMapping
    public ResponseEntity<PropertyResponse> addProperty(
            @RequestBody PropertyRequest request,
            @AuthenticationPrincipal Account currentUser) {
            
        return ResponseEntity.ok(propertyService.addProperty(request, currentUser));
    }

    @GetMapping("/my-properties")
    public ResponseEntity<List<PropertyResponse>> getMyProperties(
            @AuthenticationPrincipal Account currentUser) {
            
        return ResponseEntity.ok(propertyService.getMyProperties(currentUser));
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }
}
