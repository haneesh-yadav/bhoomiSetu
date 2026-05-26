package com.bhoomisetu.backend.services;

import com.bhoomisetu.backend.dto.DisputeRequest;
import com.bhoomisetu.backend.dto.DisputeResponse;
import com.bhoomisetu.backend.models.Dispute;
import com.bhoomisetu.backend.models.Property;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.repositories.DisputeRepository;
import com.bhoomisetu.backend.repositories.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final PropertyRepository propertyRepository;

    public DisputeResponse fileDispute(DisputeRequest request, Account filer) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Mark the property as disputed so transfers are blocked
        property.setStatus("DISPUTED");
        propertyRepository.save(property);

        Dispute dispute = Dispute.builder()
                .property(property)
                .filer(filer)
                .caseNumber(request.getCaseNumber())
                .description(request.getDescription())
                .status("ACTIVE")
                .build();

        return toResponse(disputeRepository.save(dispute));
    }

    public List<DisputeResponse> getMyDisputes(Account filer) {
        return disputeRepository.findByFiler(filer)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<DisputeResponse> getAllDisputes() {
        return disputeRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public DisputeResponse resolveDispute(Long disputeId, String status, String remarks) {
        Dispute dispute = disputeRepository.findById(disputeId)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));

        dispute.setStatus(status);
        dispute.setRemarks(remarks);

        // If resolved/dismissed, unblock the property
        if ("RESOLVED".equals(status) || "DISMISSED".equals(status)) {
            Property property = dispute.getProperty();
            property.setStatus("VERIFIED");
            propertyRepository.save(property);
        }

        return toResponse(disputeRepository.save(dispute));
    }

    private DisputeResponse toResponse(Dispute d) {
        return DisputeResponse.builder()
                .id(d.getId())
                .propertyId(d.getProperty().getId())
                .propertyTitle(d.getProperty().getTitle())
                .filerName(d.getFiler().getName())
                .caseNumber(d.getCaseNumber())
                .description(d.getDescription())
                .status(d.getStatus())
                .remarks(d.getRemarks())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
