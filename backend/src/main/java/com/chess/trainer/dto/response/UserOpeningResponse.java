package com.chess.trainer.dto.response;

import java.time.Instant;
import java.util.UUID;

public record UserOpeningResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    String moves,
    Integer movesCount,
    Boolean isPublic,
    String authorName,
    Instant createdAt,
    Instant updatedAt
) {}
