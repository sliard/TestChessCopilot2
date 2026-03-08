package com.example.app.repository;

import com.example.app.entity.Opening;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OpeningRepository extends JpaRepository<Opening, UUID> {

    // Public openings
    @EntityGraph(attributePaths = {"user"})
    Page<Opening> findByIsPublicTrue(Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Optional<Opening> findByIdAndIsPublicTrue(UUID id);

    // Public search
    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT o FROM Opening o WHERE o.isPublic = true " +
           "AND (:query IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:ecoCode IS NULL OR o.ecoCode LIKE CONCAT(:ecoCode, '%')) " +
           "AND (:moves IS NULL OR o.moves LIKE CONCAT(:moves, '%'))")
    Page<Opening> searchPublicOpenings(
        @Param("query") String query,
        @Param("ecoCode") String ecoCode,
        @Param("moves") String moves,
        Pageable pageable
    );

    // User openings
    @EntityGraph(attributePaths = {"user"})
    Page<Opening> findByUserId(UUID userId, Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Optional<Opening> findByIdAndUserId(UUID id, UUID userId);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT o FROM Opening o WHERE o.user.id = :userId AND LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Opening> searchByUserIdAndName(@Param("userId") UUID userId, @Param("query") String query, Pageable pageable);
}
