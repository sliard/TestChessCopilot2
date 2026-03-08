package com.chess.trainer.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    // Valid Base64-encoded 256-bit key for HMAC-SHA256
    private static final String TEST_SECRET = "dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtbG9uZy1lbm91Z2gtZm9yLWhtYWMtc2hhMjU2";
    private static final long ACCESS_EXPIRATION_MS = 900_000;       // 15 minutes
    private static final long REFRESH_EXPIRATION_MS = 604_800_000;  // 7 days

    private JwtService jwtService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(TEST_SECRET, ACCESS_EXPIRATION_MS, REFRESH_EXPIRATION_MS);
        userDetails = new User(
                "test@example.com",
                "encodedPassword",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Test
    @DisplayName("should generate access token when valid user details")
    void should_generateAccessToken_when_validUserDetails() {
        // Arrange — userDetails created in setUp

        // Act
        String token = jwtService.generateAccessToken(userDetails);

        // Assert
        assertThat(token).isNotNull().isNotBlank();
        assertThat(jwtService.extractEmail(token)).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("should generate refresh token when valid user details")
    void should_generateRefreshToken_when_validUserDetails() {
        // Arrange — userDetails created in setUp

        // Act
        String token = jwtService.generateRefreshToken(userDetails);

        // Assert
        assertThat(token).isNotNull().isNotBlank();
        assertThat(jwtService.extractEmail(token)).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("should extract email when valid token")
    void should_extractEmail_when_validToken() {
        // Arrange
        String token = jwtService.generateAccessToken(userDetails);

        // Act
        String email = jwtService.extractEmail(token);

        // Assert
        assertThat(email).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("should return true when token is valid")
    void should_returnTrue_when_tokenIsValid() {
        // Arrange
        String token = jwtService.generateAccessToken(userDetails);

        // Act
        boolean isValid = jwtService.isTokenValid(token, userDetails);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("should return false when token is expired")
    void should_returnFalse_when_tokenIsExpired() {
        // Arrange — create a service with 0ms expiration so the token expires immediately
        JwtService expiredJwtService = new JwtService(TEST_SECRET, 0, 0);
        String token = expiredJwtService.generateAccessToken(userDetails);

        // Act
        boolean isValid = expiredJwtService.isTokenValid(token, userDetails);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("should return false when token belongs to different user")
    void should_returnFalse_when_tokenBelongsToDifferentUser() {
        // Arrange
        String token = jwtService.generateAccessToken(userDetails);
        UserDetails differentUser = new User(
                "other@example.com",
                "encodedPassword",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        // Act
        boolean isValid = jwtService.isTokenValid(token, differentUser);

        // Assert
        assertThat(isValid).isFalse();
    }
}
