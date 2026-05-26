package com.bhoomisetu.backend.controllers;

import com.bhoomisetu.backend.dto.TransferRequest;
import com.bhoomisetu.backend.dto.TransferResponse;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.services.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
@CrossOrigin
public class TransferController {

    private final TransferService transferService;

    // Citizen: initiate a new transfer
    @PostMapping
    public ResponseEntity<TransferResponse> initiateTransfer(
            @RequestBody TransferRequest request,
            @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(transferService.initiateTransfer(request, currentUser));
    }

    // Citizen: get all transfers where they are buyer or seller
    @GetMapping("/my-transfers")
    public ResponseEntity<List<TransferResponse>> getMyTransfers(
            @AuthenticationPrincipal Account currentUser) {
        return ResponseEntity.ok(transferService.getMyTransfers(currentUser));
    }

    // Registrar: get all transfers
    @GetMapping("/all")
    public ResponseEntity<List<TransferResponse>> getAllTransfers() {
        return ResponseEntity.ok(transferService.getAllTransfers());
    }

    // Registrar: get pending transfers
    @GetMapping("/pending")
    public ResponseEntity<List<TransferResponse>> getPendingTransfers() {
        return ResponseEntity.ok(transferService.getPendingTransfers());
    }

    // Registrar: get transfer by id
    @GetMapping("/{id}")
    public ResponseEntity<TransferResponse> getTransferById(@PathVariable Long id) {
        return ResponseEntity.ok(transferService.getTransferById(id));
    }

    // Registrar: review transfer
    @PutMapping("/{id}/review")
    public ResponseEntity<TransferResponse> reviewTransfer(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false, defaultValue = "") String remarks) {
        return ResponseEntity.ok(transferService.reviewTransfer(id, status, remarks));
    }
}
