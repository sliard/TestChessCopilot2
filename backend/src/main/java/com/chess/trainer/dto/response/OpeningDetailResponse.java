package com.chess.trainer.dto.response;

import java.time.Instant;
import java.util.UUID;

public record OpeningDetailResponse(
        UUID id,
        String name,
        String description,
        String ecoCode,
        String moves,
        String author,
        Instant createdAt,
        Instant updatedAt
) {
}
