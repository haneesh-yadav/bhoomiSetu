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
@Table(name = "transfers")
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The property being transferred
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    // The current owner initiating the transfer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private Account seller;

    // The new buyer (looked up by aadhaar/email)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private Account buyer;

    // PENDING, APPROVED, REJECTED
    @Builder.Default
    private String status = "PENDING";

    private String remarks; // Registrar can add remarks on approval/rejection

    @CreationTimestamp
    private LocalDateTime createdAt;
}
