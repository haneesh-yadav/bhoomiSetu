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
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String address;
    
    private String area; // e.g. "5 Acres"

    private String type; // Residential, Agricultural, Commercial
    
    private String surveyNo;
    
    private String district;
    
    private String state;
    
    private String pincode;
    
    private String marketValue;

    private String status; // e.g. "Clear Title", "Encumbered"
    
    private boolean encumbrance;
    
    private boolean disputeActive;
    
    private String hash;
    
    private Long blockNumber;
    
    private String lastTransfer;

    // Foreign Key: Links this property to a specific Account (Owner)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Account owner;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
