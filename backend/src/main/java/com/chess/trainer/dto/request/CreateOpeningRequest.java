package com.chess.trainer.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateOpeningRequest(
    @NotBlank @Size(max = 255) String name,
    @Size(max = 2000) String description,
    @Size(max = 10) String ecoCode,
    @NotBlank String moves,
    @NotNull Boolean isPublic
) {}
