package com.chess.trainer.repository;

import com.chess.trainer.entity.Opening;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OpeningRepository extends JpaRepository<Opening, UUID> {

    Page<Opening> findByIsPublicTrue(Pageable pageable);

    Page<Opening> findByIsPublicTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
}
