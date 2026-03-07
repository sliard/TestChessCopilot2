package com.example.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
        String code,
        String message,
        int status,
        String path,
        Instant timestamp,
        List<String> errors
) {
    public ErrorResponse(String code, String message) {
        this(code, message, 0, null, Instant.now(), null);
    }

    public ErrorResponse(String code, String message, int status, String path) {
        this(code, message, status, path, Instant.now(), null);
    }

    public ErrorResponse(String code, String message, int status, String path, List<String> errors) {
        this(code, message, status, path, Instant.now(), errors);
    }
}
