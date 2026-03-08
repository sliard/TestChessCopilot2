package com.example.app.dto;

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
) {}
