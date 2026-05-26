package com.bhoomisetu.backend.services;

import com.bhoomisetu.backend.dto.PropertyRequest;
import com.bhoomisetu.backend.dto.PropertyResponse;
import com.bhoomisetu.backend.models.Property;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.repositories.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyResponse addProperty(PropertyRequest request, Account owner) {
        
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
                .hash(null)
                .blockNumber(null)
                .lastTransfer(null)
                .owner(owner)
                .build();
                
        Property savedProperty = propertyRepository.save(property);
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
                .status(property.getStatus())
                .encumbrance(property.isEncumbrance())
                .disputeActive(property.isDisputeActive())
                .hash(property.getHash())
                .blockNumber(property.getBlockNumber())
                .lastTransfer(property.getLastTransfer())
                .timeline(new java.util.ArrayList<>())
                .createdAt(property.getCreatedAt())
                .ownerId(property.getOwner().getId())
                .ownerName(property.getOwner().getName())
                .ownerEmail(property.getOwner().getEmail())
                .build();
    }
}
