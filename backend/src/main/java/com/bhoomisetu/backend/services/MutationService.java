package com.bhoomisetu.backend.services;

import com.bhoomisetu.backend.dto.MutationRequest;
import com.bhoomisetu.backend.dto.MutationResponse;
import com.bhoomisetu.backend.models.Mutation;
import com.bhoomisetu.backend.models.Property;
import com.bhoomisetu.backend.models.Account;
import com.bhoomisetu.backend.repositories.MutationRepository;
import com.bhoomisetu.backend.repositories.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MutationService {

    private final MutationRepository mutationRepository;
    private final PropertyRepository propertyRepository;

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

        return toResponse(mutationRepository.save(mutation));
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
}
