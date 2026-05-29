package com.bhoomisetu.backend.repositories;

import com.bhoomisetu.backend.models.PropertyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyEventRepository extends JpaRepository<PropertyEvent, Long> {
    List<PropertyEvent> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    List<PropertyEvent> findAllByOrderByCreatedAtDesc();
}
