package com.bhoomisetu.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "property_events")
public class PropertyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private String event; // e.g., "Ownership Transfer", "Initial Registration"
    
    @Column(name = "from_party")
    private String from;
    
    @Column(name = "to_party")
    private String to;
    
    private String date; // E.g. "22 March 2026"
    
    private String hash;
    
    private String status; // "VERIFIED", "GENESIS", "PENDING"
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
