package com.chessot.repository;

import com.chessot.entity.Opening;
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

    Optional<Opening> findByIdAndIsPublicTrue(UUID id);

    Page<Opening> findByUserId(UUID userId, Pageable pageable);

    Optional<Opening> findByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT o FROM Opening o WHERE o.isPublic = true "
            + "AND (:query IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))) "
            + "AND (:ecoCode IS NULL OR o.ecoCode LIKE CONCAT(:ecoCode, '%')) "
            + "AND (:moves IS NULL OR o.moves LIKE CONCAT(:moves, '%'))")
    Page<Opening> searchPublicOpenings(
            @Param("query") String query,
            @Param("ecoCode") String ecoCode,
            @Param("moves") String moves,
            Pageable pageable
    );

    @Query("SELECT o FROM Opening o WHERE o.user.id = :userId "
            + "AND (:query IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))) "
            + "AND (:ecoCode IS NULL OR o.ecoCode LIKE CONCAT(:ecoCode, '%')) "
            + "AND (:moves IS NULL OR o.moves LIKE CONCAT(:moves, '%')) "
            + "AND (:isPublic IS NULL OR o.isPublic = :isPublic)")
    Page<Opening> searchUserOpenings(
            @Param("userId") UUID userId,
            @Param("query") String query,
            @Param("ecoCode") String ecoCode,
            @Param("moves") String moves,
            @Param("isPublic") Boolean isPublic,
            Pageable pageable
    );
}
