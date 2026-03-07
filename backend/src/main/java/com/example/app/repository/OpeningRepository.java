package com.example.app.repository;

import com.example.app.entity.Opening;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OpeningRepository extends JpaRepository<Opening, UUID> {

    Page<Opening> findByIsPublicTrue(Pageable pageable);

    @Query("SELECT o FROM Opening o WHERE o.isPublic = true AND LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Opening> searchPublicByName(@Param("query") String query, Pageable pageable);

    Optional<Opening> findByIdAndIsPublicTrue(UUID id);
}
