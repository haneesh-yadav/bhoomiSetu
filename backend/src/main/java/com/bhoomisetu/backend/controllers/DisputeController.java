package com.bhoomisetu.backend.controllers;

import com.bhoomisetu.backend.dto.DisputeRequest;
import com.bhoomisetu.backend.dto.DisputeResponse;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.services.DisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
@CrossOrigin
public class DisputeController {

    private final DisputeService disputeService;

    @PostMapping
    public ResponseEntity<DisputeResponse> fileDispute(
            @RequestBody DisputeRequest request,
            @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(disputeService.fileDispute(request, currentUser));
    }

    @GetMapping("/my-disputes")
    public ResponseEntity<List<DisputeResponse>> getMyDisputes(
            @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(disputeService.getMyDisputes(currentUser));
    }

    // Registrar endpoints
    @GetMapping("/all")
    public ResponseEntity<List<DisputeResponse>> getAllDisputes() {
        return ResponseEntity.ok(disputeService.getAllDisputes());
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<DisputeResponse> resolveDispute(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false, defaultValue = "") String remarks) {
        return ResponseEntity.ok(disputeService.resolveDispute(id, status, remarks));
    }
}
