package com.chess.trainer.dto.response;

import java.time.Instant;
import java.util.UUID;

public record OpeningListItemResponse(
        UUID id,
        String name,
        String description,
        String ecoCode,
        int movesCount,
        String author,
        Instant createdAt
) {
}
