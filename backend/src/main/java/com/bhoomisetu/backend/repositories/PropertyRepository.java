package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    
    // Finds all properties owned by a specific user ID
    List<Property> findByOwnerId(Long ownerId);
    
    // Finds all properties by status (e.g., "available")
    List<Property> findByStatus(String status);
}
