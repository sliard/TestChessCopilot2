package com.example.app.security;

import com.example.app.entity.Role;
import com.example.app.entity.User;
import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.HashMap;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private JwtService jwtService;

    private User testUser;

    // Base64-encoded 256-bit key for HS256
    private static final String TEST_SECRET_KEY = "dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtbG9uZy1lbm91Z2gtZm9yLWhzMjU2LWFsZ29yaXRobQ==";
    private static final long TEST_EXPIRATION_MS = 3600000L;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", TEST_SECRET_KEY);
        ReflectionTestUtils.setField(jwtService, "accessTokenExpirationMs", TEST_EXPIRATION_MS);

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .password("encoded-password")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .build();
    }

    @Test
    void should_generateValidToken_when_validUserDetails() {
        // Arrange — user is set up in @BeforeEach

        // Act
        String token = jwtService.generateToken(testUser);

        // Assert
        assertThat(token).isNotNull().isNotBlank();
        String extractedUsername = jwtService.extractUsername(token);
        assertThat(extractedUsername).isEqualTo(testUser.getEmail());
    }

    @Test
    void should_extractUsername_from_validToken() {
        // Arrange
        String token = jwtService.generateToken(testUser);

        // Act
        String username = jwtService.extractUsername(token);

        // Assert
        assertThat(username).isEqualTo("test@example.com");
    }

    @Test
    void should_returnTrue_when_tokenIsValid() {
        // Arrange
        String token = jwtService.generateToken(testUser);

        // Act
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    void should_returnFalse_when_tokenBelongsToDifferentUser() {
        // Arrange
        String token = jwtService.generateToken(testUser);
        User otherUser = User.builder()
                .id(UUID.randomUUID())
                .email("other@example.com")
                .password("encoded-password")
                .firstName("Jane")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .build();

        // Act
        boolean isValid = jwtService.isTokenValid(token, otherUser);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    void should_throwException_when_tokenIsExpired() {
        // Arrange — set a very short expiration
        ReflectionTestUtils.setField(jwtService, "accessTokenExpirationMs", 1L);
        String token = jwtService.generateToken(testUser);

        // Wait for token to expire
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Act & Assert
        assertThatThrownBy(() -> jwtService.isTokenValid(token, testUser))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    void should_returnExpirationMs() {
        // Arrange — expiration is set in @BeforeEach

        // Act
        long expirationMs = jwtService.getAccessTokenExpirationMs();

        // Assert
        assertThat(expirationMs).isEqualTo(TEST_EXPIRATION_MS);
    }

    @Test
    void should_generateTokenWithExtraClaims_when_extraClaimsProvided() {
        // Arrange
        var extraClaims = new HashMap<String, Object>();
        extraClaims.put("role", "ROLE_USER");

        // Act
        String token = jwtService.generateToken(extraClaims, testUser);

        // Assert
        assertThat(token).isNotNull().isNotBlank();
        assertThat(jwtService.extractUsername(token)).isEqualTo(testUser.getEmail());
    }
}
