package com.chessot.dto.response;

import java.time.Instant;
import java.util.UUID;

public record OpeningDetailResponse(
        UUID id,
        String name,
        String description,
        String ecoCode,
        String moves,
        Boolean isPublic,
        String author,
        Instant createdAt,
        Instant updatedAt
) {
}
