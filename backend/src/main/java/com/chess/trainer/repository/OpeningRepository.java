package com.chess.trainer.repository;

import com.chess.trainer.entity.Opening;
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

    Page<Opening> findByIsPublicTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

    Page<Opening> findByUserId(UUID userId, Pageable pageable);

    Optional<Opening> findByIdAndUserId(UUID id, UUID userId);

    @Query("SELECT o FROM Opening o WHERE o.userId = :userId AND LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Opening> searchByUserIdAndName(@Param("userId") UUID userId, @Param("query") String query, Pageable pageable);
}
