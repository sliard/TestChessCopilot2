package com.chessot.dto.response;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        Long expiresIn
) {
}
