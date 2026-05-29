package com.bhoomisetu.backend.services;

import com.bhoomisetu.backend.dto.PropertyRequest;
import com.bhoomisetu.backend.dto.PropertyResponse;
import com.bhoomisetu.backend.dto.PropertyEventDto;
import com.bhoomisetu.backend.models.Property;
import com.bhoomisetu.backend.models.PropertyEvent;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.repositories.PropertyRepository;
import com.bhoomisetu.backend.repositories.PropertyEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyEventRepository propertyEventRepository;

    public PropertyResponse addProperty(PropertyRequest request, Account owner) {
        long mockBlock = 1800000L + (long) (Math.random() * 50000L);
        String mockHash = "0x" + (java.util.UUID.randomUUID().toString() + java.util.UUID.randomUUID().toString()).replace("-", "");

        Property property = Property.builder()
                .title(request.getTitle())
                .type(request.getType())
                .area(request.getArea())
                .address(request.getAddress())
                .district(request.getDistrict())
                .state(request.getState())
                .pincode(request.getPincode())
                .surveyNo(request.getSurveyNo())
                .marketValue(request.getMarketValue())
                .status("VERIFICATION_PENDING") // Default status for new properties
                .encumbrance(false)
                .disputeActive(false)
                .hash(mockHash)
                .blockNumber(mockBlock)
                .lastTransfer("Original Registration")
                .owner(owner)
                .build();
                
        Property savedProperty = propertyRepository.save(property);

        // Log the initial registration event to the timeline
        logEvent(savedProperty, "Property Registered", "N/A", owner.getName(), "GENESIS", mockHash);

        return mapToResponse(savedProperty);
    }

    public List<PropertyResponse> getMyProperties(Account owner) {
        List<Property> properties = propertyRepository.findByOwnerId(owner.getId());
        return properties.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PropertyResponse> getAllProperties() {
        List<Property> properties = propertyRepository.findAll();
        return properties.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return mapToResponse(property);
    }
    
    // Helper method to convert Entity to DTO
    private PropertyResponse mapToResponse(Property property) {
        String displayStatus = property.getStatus();
        if ("VERIFIED".equals(displayStatus)) {
            displayStatus = "Clear Title";
        } else if ("VERIFICATION_PENDING".equals(displayStatus)) {
            displayStatus = "Verification Pending";
        } else if ("DISPUTED".equals(displayStatus)) {
            displayStatus = "Disputed";
        } else if ("TRANSFER_PENDING".equals(displayStatus)) {
            displayStatus = "Transfer Pending";
        }

        String registeredOnDate = property.getCreatedAt() != null 
                ? property.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"))
                : java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));

        List<PropertyEventDto> timeline = propertyEventRepository.findByPropertyIdOrderByCreatedAtDesc(property.getId())
                .stream()
                .map(event -> PropertyEventDto.builder()
                        .id(event.getId())
                        .propertyId(event.getProperty().getId())
                        .propertyTitle(event.getProperty().getTitle())
                        .event(event.getEvent())
                        .from(event.getFrom())
                        .to(event.getTo())
                        .date(event.getDate())
                        .hash(event.getHash())
                        .status(event.getStatus())
                        .build())
                .collect(Collectors.toList());

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .type(property.getType())
                .area(property.getArea())
                .address(property.getAddress())
                .district(property.getDistrict())
                .state(property.getState())
                .pincode(property.getPincode())
                .surveyNo(property.getSurveyNo())
                .marketValue(property.getMarketValue())
                .status(displayStatus)
                .encumbrance(property.isEncumbrance())
                .disputeActive(property.isDisputeActive())
                .hash(property.getHash())
                .blockNumber(property.getBlockNumber())
                .lastTransfer(property.getLastTransfer())
                .timeline(timeline)
                .createdAt(property.getCreatedAt())
                .registeredOn(registeredOnDate)
                .ownerId(property.getOwner().getId())
                .ownerName(property.getOwner().getName())
                .ownerEmail(property.getOwner().getEmail())
                .build();
    }

    public List<PropertyEventDto> getAllEvents() {
        return propertyEventRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(event -> PropertyEventDto.builder()
                        .id(event.getId())
                        .propertyId(event.getProperty().getId())
                        .propertyTitle(event.getProperty().getTitle())
                        .event(event.getEvent())
                        .from(event.getFrom())
                        .to(event.getTo())
                        .date(event.getDate())
                        .hash(event.getHash())
                        .status(event.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    private void logEvent(Property property, String eventName, String from, String to, String status, String customHash) {
        String eventHash = customHash != null ? customHash : "0x" + (java.util.UUID.randomUUID().toString() + java.util.UUID.randomUUID().toString()).replace("-", "");
        String formattedDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
        
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
