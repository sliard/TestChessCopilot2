package com.chess.trainer.dto.request;

import jakarta.validation.constraints.NotNull;

public record UpdateVisibilityRequest(
    @NotNull Boolean isPublic
) {}
