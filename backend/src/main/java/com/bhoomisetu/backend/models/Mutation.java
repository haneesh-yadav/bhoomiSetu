package com.bhoomisetu.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mutations")
public class Mutation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private Account applicant;

    private String reason; // e.g. "Inheritance", "Name Correction"
    private String newOwnerName;
    private String supportingDoc; // uploaded doc reference

    @Builder.Default
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    private String remarks;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
