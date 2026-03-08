package com.chess.trainer.dto.response;

import java.time.Instant;
import java.util.UUID;

public record UserOpeningListItemResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    Integer movesCount,
    Boolean isPublic,
    Instant createdAt,
    Instant updatedAt
) {}
