package com.example.app.dto;

import java.time.Instant;
import java.util.UUID;

public record OpeningListItemResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    Integer movesCount,
    String author,
    Instant createdAt
) {}
