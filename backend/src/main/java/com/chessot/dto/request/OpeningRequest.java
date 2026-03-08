package com.chessot.dto.request;

import jakarta.validation.constraints.NotBlank;

public record OpeningRequest(
        @NotBlank(message = "Name is required")
        String name,

        String description,

        String ecoCode,

        @NotBlank(message = "Moves are required")
        String moves,

        Boolean isPublic
) {
    public OpeningRequest {
        if (isPublic == null) {
            isPublic = false;
        }
    }
}
