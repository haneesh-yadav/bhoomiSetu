package com.bhoomisetu.backend.services;

import com.bhoomisetu.backend.dto.TransferRequest;
import com.bhoomisetu.backend.dto.TransferResponse;
import com.bhoomisetu.backend.models.Property;
import com.bhoomisetu.backend.models.Transfer;
import com.bhoomisetu.backend.models.PropertyEvent;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.repositories.PropertyRepository;
import com.bhoomisetu.backend.repositories.TransferRepository;
import com.bhoomisetu.backend.repositories.AccountRepository;
import com.bhoomisetu.backend.repositories.PropertyEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransferService {

    private final TransferRepository transferRepository;
    private final PropertyRepository propertyRepository;
    private final AccountRepository accountRepository;
    private final PropertyEventRepository propertyEventRepository;

    public TransferResponse initiateTransfer(TransferRequest request, Account seller) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (!property.getOwner().getId().equals(seller.getId())) {
            throw new RuntimeException("You are not the owner of this property");
        }

        if ("TRANSFER_PENDING".equals(property.getStatus())) {
            throw new RuntimeException("A transfer is already pending for this property");
        }

        Account buyer = accountRepository.findByEmail(request.getBuyerEmail())
                .orElseThrow(() -> new RuntimeException("Buyer not found with email: " + request.getBuyerEmail()));

        if (buyer.getId().equals(seller.getId())) {
            throw new RuntimeException("You cannot transfer a property to yourself");
        }

        // Mark the property as transfer pending
        property.setStatus("TRANSFER_PENDING");
        propertyRepository.save(property);

        Transfer transfer = Transfer.builder()
                .property(property)
                .seller(seller)
                .buyer(buyer)
                .remarks(request.getRemarks())
                .saleValue(request.getSaleValue())
                .status("PENDING")
                .build();

        return toResponse(transferRepository.save(transfer));
    }

    public List<TransferResponse> getMyTransfers(Account user) {
        return transferRepository.findBySellerOrBuyer(user, user)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Registrar: get all transfers
    public List<TransferResponse> getAllTransfers() {
        return transferRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Registrar: get pending transfers
    public List<TransferResponse> getPendingTransfers() {
        return transferRepository.findByStatus("PENDING")
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // Registrar: get transfer by id
    public TransferResponse getTransferById(Long id) {
        return transferRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Transfer not found"));
    }

    // Registrar: approve or reject
    public TransferResponse reviewTransfer(Long transferId, String status, String remarks) {
        Transfer transfer = transferRepository.findById(transferId)
                .orElseThrow(() -> new RuntimeException("Transfer not found"));

        transfer.setStatus(status);
        transfer.setRemarks(remarks);

        if ("APPROVED".equals(status)) {
            // Transfer ownership
            Property property = transfer.getProperty();
            property.setOwner(transfer.getBuyer());
            property.setStatus("VERIFIED");
            
            // Set last transfer details
            String formattedDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
            property.setLastTransfer("Transfer on " + formattedDate);
            
            // Generate mock transaction details to reflect blockchain updates
            long mockBlock = 1800000L + (long) (Math.random() * 50000L);
            String mockHash = "0x" + (java.util.UUID.randomUUID().toString() + java.util.UUID.randomUUID().toString()).replace("-", "");
            property.setHash(mockHash);
            property.setBlockNumber(mockBlock);
            
            propertyRepository.save(property);
            
            // Log timeline event
            logEvent(property, "Ownership Transfer", transfer.getSeller().getName(), transfer.getBuyer().getName(), "VERIFIED", mockHash, formattedDate);
        } else if ("REJECTED".equals(status)) {
            // Unblock the property
            Property property = transfer.getProperty();
            property.setStatus("VERIFIED");
            propertyRepository.save(property);
            
            // Log timeline event
            String formattedDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
            logEvent(property, "Transfer Rejected", transfer.getSeller().getName(), transfer.getBuyer().getName(), "REJECTED", null, formattedDate);
        }

        return toResponse(transferRepository.save(transfer));
    }

    private TransferResponse toResponse(Transfer t) {
        String initiatedOnDate = t.getCreatedAt() != null 
                ? t.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"))
                : java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));

        return TransferResponse.builder()
                .id(t.getId())
                .propertyId(t.getProperty().getId())
                .propertyTitle(t.getProperty().getTitle())
                .sellerName(t.getSeller().getName())
                .buyerName(t.getBuyer().getName())
                .buyerEmail(t.getBuyer().getEmail())
                .status(t.getStatus())
                .remarks(t.getRemarks())
                .saleValue(t.getSaleValue())
                .initiatedOn(initiatedOnDate)
                .createdAt(t.getCreatedAt())
                .build();
    }

    private void logEvent(Property property, String eventName, String from, String to, String status, String customHash, String formattedDate) {
        String eventHash = customHash != null ? customHash : "0x" + (java.util.UUID.randomUUID().toString() + java.util.UUID.randomUUID().toString()).replace("-", "");
        
        PropertyEvent event = PropertyEvent.builder()
                .property(property)
                .event(eventName)
                .from(from)
                .to(to)
                .date(formattedDate)
                .hash(eventHash)
                .status(status)
                .build();
        propertyEventRepository.save(event);
    }
}
