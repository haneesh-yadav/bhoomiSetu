package com.bhoomisetu.backend.services;

import com.bhoomisetu.backend.dto.MutationRequest;
import com.bhoomisetu.backend.dto.MutationResponse;
import com.bhoomisetu.backend.models.Mutation;
import com.bhoomisetu.backend.models.Property;
import com.bhoomisetu.backend.models.PropertyEvent;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.repositories.MutationRepository;
import com.bhoomisetu.backend.repositories.PropertyRepository;
import com.bhoomisetu.backend.repositories.AccountRepository;
import com.bhoomisetu.backend.repositories.PropertyEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MutationService {

    private final MutationRepository mutationRepository;
    private final PropertyRepository propertyRepository;
    private final AccountRepository accountRepository;
    private final PropertyEventRepository propertyEventRepository;

    public MutationResponse requestMutation(MutationRequest request, Account applicant) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        Mutation mutation = Mutation.builder()
                .property(property)
                .applicant(applicant)
                .reason(request.getReason())
                .newOwnerName(request.getNewOwnerName())
                .supportingDoc(request.getSupportingDoc())
                .status("PENDING")
                .build();

        Mutation savedMutation = mutationRepository.save(mutation);

        // Log timeline event
        String formattedDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
        String reasonTitle = request.getReason() != null ? request.getReason().split(" \\| ")[0] : "Request";
        logEvent(property, "Mutation Request Raised: " + reasonTitle, applicant.getName(), "Sub-Registrar", "PENDING", null, formattedDate);

        return toResponse(savedMutation);
    }

    public List<MutationResponse> getMyMutations(Account applicant) {
        return mutationRepository.findByApplicant(applicant)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MutationResponse> getAllMutations() {
        return mutationRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<MutationResponse> getPendingMutations() {
        return mutationRepository.findByStatus("PENDING")
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public MutationResponse reviewMutation(Long mutationId, String status, String remarks) {
        Mutation mutation = mutationRepository.findById(mutationId)
                .orElseThrow(() -> new RuntimeException("Mutation not found"));

        mutation.setStatus(status);
        mutation.setRemarks(remarks);

        if ("APPROVED".equals(status)) {
            Property property = mutation.getProperty();
            String reason = mutation.getReason();
            String formattedDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
            
            // Generate mock transaction details to reflect blockchain updates
            long mockBlock = 1800000L + (long) (Math.random() * 50000L);
            String mockHash = "0x" + (java.util.UUID.randomUUID().toString() + java.util.UUID.randomUUID().toString()).replace("-", "");
            property.setHash(mockHash);
            property.setBlockNumber(mockBlock);
            propertyRepository.save(property);

            if (reason != null && reason.contains("[Inheritance]")) {
                // Try to find the heir account by name to transfer ownership
                java.util.Optional<Account> heirOpt = accountRepository.findByName(mutation.getNewOwnerName());
                if (heirOpt.isPresent()) {
                    property.setOwner(heirOpt.get());
                    property.setLastTransfer("Inherited on " + formattedDate);
                    propertyRepository.save(property);
                    logEvent(property, "Inheritance Succession", mutation.getApplicant().getName(), mutation.getNewOwnerName(), "VERIFIED", mockHash, formattedDate);
                } else {
                    // Fallback if heir account is not yet created/registered
                    property.setLastTransfer("Inherited on " + formattedDate);
                    propertyRepository.save(property);
                    logEvent(property, "Inheritance (Heir Account Not Found)", mutation.getApplicant().getName(), mutation.getNewOwnerName(), "VERIFIED", mockHash, formattedDate);
                }
            } else if (reason != null && reason.contains("[Survey Correction]")) {
                // Parse "Correct: <survey_no>, <area>"
                try {
                    String part = reason.substring(reason.indexOf("Correct: ") + 9);
                    if (part.contains(" | ")) {
                        part = part.substring(0, part.indexOf(" | "));
                    }
                    String[] split = part.split(",");
                    if (split.length >= 2) {
                        String correctSurvey = split[0].trim();
                        String correctArea = split[1].trim();
                        property.setSurveyNo(correctSurvey);
                        property.setArea(correctArea);
                        propertyRepository.save(property);
                    }
                } catch (Exception e) {
                    // Ignore parsing error
                }
                logEvent(property, "Survey Correction Approved", "Sub-Registrar", property.getOwner().getName(), "VERIFIED", mockHash, formattedDate);
            } else if (reason != null && reason.contains("[Partition]")) {
                // Mark partitioned
                if (!property.getTitle().contains("(Partitioned)")) {
                    property.setTitle(property.getTitle() + " (Partitioned)");
                    propertyRepository.save(property);
                }
                logEvent(property, "Property Partitioned", "Sub-Registrar", property.getOwner().getName(), "VERIFIED", mockHash, formattedDate);
            } else if (reason != null && reason.contains("[Name Change]")) {
                // Update owner's account name
                Account owner = property.getOwner();
                String oldName = owner.getName();
                owner.setName(mutation.getNewOwnerName());
                accountRepository.save(owner);
                
                logEvent(property, "Owner Name Changed", oldName, mutation.getNewOwnerName(), "VERIFIED", mockHash, formattedDate);
            } else {
                // Fallback for other mutation reasons
                String reasonTitle = reason != null ? reason.split(" \\| ")[0] : "Request";
                logEvent(property, "Mutation Approved: " + reasonTitle, "Sub-Registrar", property.getOwner().getName(), "VERIFIED", mockHash, formattedDate);
            }
        } else if ("REJECTED".equals(status)) {
            Property property = mutation.getProperty();
            String formattedDate = java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
            String reasonTitle = mutation.getReason() != null ? mutation.getReason().split(" \\| ")[0] : "Request";
            logEvent(property, "Mutation Rejected: " + reasonTitle, "Sub-Registrar", mutation.getApplicant().getName(), "REJECTED", null, formattedDate);
        }

        return toResponse(mutationRepository.save(mutation));
    }

    private MutationResponse toResponse(Mutation m) {
        return MutationResponse.builder()
                .id(m.getId())
                .propertyId(m.getProperty().getId())
                .propertyTitle(m.getProperty().getTitle())
                .applicantName(m.getApplicant().getName())
                .reason(m.getReason())
                .newOwnerName(m.getNewOwnerName())
                .status(m.getStatus())
                .remarks(m.getRemarks())
                .createdAt(m.getCreatedAt())
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
