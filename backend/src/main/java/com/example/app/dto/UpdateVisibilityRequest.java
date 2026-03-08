package com.example.app.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateVisibilityRequest(
    @NotNull Boolean isPublic
) {}
