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
    /**
     * Returns whether the opening is public, defaulting to false if not specified.
     */
    public boolean isPublicOrDefault() {
        return isPublic != null && isPublic;
    }
}
