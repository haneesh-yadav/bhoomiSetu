package com.bhoomisetu.backend.controllers;

import com.bhoomisetu.backend.dto.MutationRequest;
import com.bhoomisetu.backend.dto.MutationResponse;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.services.MutationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mutations")
@RequiredArgsConstructor
@CrossOrigin
public class MutationController {

    private final MutationService mutationService;

    @PostMapping
    public ResponseEntity<MutationResponse> requestMutation(
            @RequestBody MutationRequest request,
            @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(mutationService.requestMutation(request, currentUser));
    }

    @GetMapping("/my-mutations")
    public ResponseEntity<List<MutationResponse>> getMyMutations(
            @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(mutationService.getMyMutations(currentUser));
    }

    // Registrar endpoints
    @GetMapping("/all")
    public ResponseEntity<List<MutationResponse>> getAllMutations() {
        return ResponseEntity.ok(mutationService.getAllMutations());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<MutationResponse>> getPendingMutations() {
        return ResponseEntity.ok(mutationService.getPendingMutations());
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<MutationResponse> reviewMutation(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false, defaultValue = "") String remarks) {
        return ResponseEntity.ok(mutationService.reviewMutation(id, status, remarks));
    }
}
