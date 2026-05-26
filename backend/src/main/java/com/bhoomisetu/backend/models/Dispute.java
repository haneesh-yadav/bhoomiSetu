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
@Table(name = "disputes")
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filer_id", nullable = false)
    private Account filer; // the citizen who filed the dispute

    private String caseNumber;   // Court case reference number
    private String description;  // Detailed description of the dispute

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, RESOLVED, DISMISSED

    private String remarks; // Registrar's resolution notes

    @CreationTimestamp
    private LocalDateTime createdAt;
}
