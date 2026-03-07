package com.example.app.service;

import com.example.app.dto.LoginRequest;
import com.example.app.dto.RefreshTokenRequest;
import com.example.app.dto.RegisterRequest;
import com.example.app.entity.RefreshToken;
import com.example.app.entity.Role;
import com.example.app.entity.User;
import com.example.app.repository.RefreshTokenRepository;
import com.example.app.repository.UserRepository;
import com.example.app.security.JwtService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private RefreshToken testRefreshToken;

    private static final long REFRESH_TOKEN_EXPIRATION_MS = 604800000L;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshTokenExpirationMs", REFRESH_TOKEN_EXPIRATION_MS);

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .password("encoded-password")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .build();

        testRefreshToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .token("valid-refresh-token")
                .user(testUser)
                .expiryDate(Instant.now().plusMillis(REFRESH_TOKEN_EXPIRATION_MS))
                .build();
    }

    @Test
    void should_registerUser_when_validRequest() {
        // Arrange
        var request = new RegisterRequest("test@example.com", "Password1", "John", "Doe");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any(User.class))).thenReturn("access-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(3600000L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);

        // Act
        var response = authService.register(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.refreshToken()).isEqualTo("valid-refresh-token");
        assertThat(response.expiresIn()).isEqualTo(3600000L);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void should_throwException_when_emailAlreadyExists() {
        // Arrange
        var request = new RegisterRequest("test@example.com", "Password1", "John", "Doe");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("email");
    }

    @Test
    void should_loginUser_when_validCredentials() {
        // Arrange
        var request = new LoginRequest("test@example.com", "Password1");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(testUser, null));
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtService.generateToken(testUser)).thenReturn("access-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(3600000L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);

        // Act
        var response = authService.login(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.refreshToken()).isEqualTo("valid-refresh-token");
        assertThat(response.expiresIn()).isEqualTo(3600000L);
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void should_refreshToken_when_validRefreshToken() {
        // Arrange
        var request = new RefreshTokenRequest("valid-refresh-token");
        var newRefreshToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .token("new-refresh-token")
                .user(testUser)
                .expiryDate(Instant.now().plusMillis(REFRESH_TOKEN_EXPIRATION_MS))
                .build();
        when(refreshTokenRepository.findByToken("valid-refresh-token")).thenReturn(Optional.of(testRefreshToken));
        when(jwtService.generateToken(testUser)).thenReturn("new-access-token");
        when(jwtService.getAccessTokenExpirationMs()).thenReturn(3600000L);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(newRefreshToken);

        // Act
        var response = authService.refreshToken(request);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.accessToken()).isEqualTo("new-access-token");
        assertThat(response.refreshToken()).isEqualTo("new-refresh-token");
        verify(refreshTokenRepository).delete(testRefreshToken);
    }

    @Test
    void should_throwException_when_refreshTokenExpired() {
        // Arrange
        var expiredToken = RefreshToken.builder()
                .id(UUID.randomUUID())
                .token("expired-refresh-token")
                .user(testUser)
                .expiryDate(Instant.now().minusMillis(1000))
                .build();
        var request = new RefreshTokenRequest("expired-refresh-token");
        when(refreshTokenRepository.findByToken("expired-refresh-token")).thenReturn(Optional.of(expiredToken));

        // Act & Assert
        assertThatThrownBy(() -> authService.refreshToken(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("expiré");
        verify(refreshTokenRepository).delete(expiredToken);
    }

    @Test
    void should_throwException_when_refreshTokenInvalid() {
        // Arrange
        var request = new RefreshTokenRequest("invalid-token");
        when(refreshTokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.refreshToken(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("invalide");
    }

    @Test
    void should_logout_when_authenticatedUser() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        authService.logout("test@example.com");

        // Assert
        verify(refreshTokenRepository).deleteByUser(testUser);
    }

    @Test
    void should_throwException_when_logoutUserNotFound() {
        // Arrange
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.logout("unknown@example.com"))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void should_returnUser_when_getCurrentUser() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        var response = authService.getCurrentUser("test@example.com");

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.id()).isEqualTo(testUser.getId());
        assertThat(response.email()).isEqualTo("test@example.com");
        assertThat(response.firstName()).isEqualTo("John");
        assertThat(response.lastName()).isEqualTo("Doe");
        assertThat(response.role()).isEqualTo("USER");
    }
}
