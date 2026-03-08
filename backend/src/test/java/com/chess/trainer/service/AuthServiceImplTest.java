package com.chess.trainer.service;

import com.chess.trainer.dto.request.LoginRequest;
import com.chess.trainer.dto.request.RefreshTokenRequest;
import com.chess.trainer.dto.request.RegisterRequest;
import com.chess.trainer.dto.response.AuthResponse;
import com.chess.trainer.dto.response.UserResponse;
import com.chess.trainer.entity.Role;
import com.chess.trainer.entity.User;
import com.chess.trainer.exception.EmailAlreadyExistsException;
import com.chess.trainer.exception.InvalidCredentialsException;
import com.chess.trainer.exception.ResourceNotFoundException;
import com.chess.trainer.repository.UserRepository;
import com.chess.trainer.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testUser;
    private UserDetails testUserDetails;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .password("encodedPassword")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        testUserDetails = new org.springframework.security.core.userdetails.User(
                "test@example.com",
                "encodedPassword",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    // ─── Register ───────────────────────────────────────────────────────

    @Test
    @DisplayName("should register user when email not taken")
    void should_registerUser_when_emailNotTaken() {
        // Arrange
        var request = new RegisterRequest("test@example.com", "Password1!", "John", "Doe");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1!")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(testUserDetails);
        when(jwtService.generateAccessToken(testUserDetails)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(testUserDetails)).thenReturn("refresh-token");
        when(jwtService.getAccessExpirationMs()).thenReturn(900_000L);

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.refreshToken()).isEqualTo("refresh-token");
        assertThat(response.expiresIn()).isEqualTo(900_000L);

        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateAccessToken(testUserDetails);
        verify(jwtService).generateRefreshToken(testUserDetails);
    }

    @Test
    @DisplayName("should throw EmailAlreadyExistsException when email taken")
    void should_throwEmailAlreadyExistsException_when_emailTaken() {
        // Arrange
        var request = new RegisterRequest("test@example.com", "Password1!", "John", "Doe");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("test@example.com");

        verify(userRepository, never()).save(any(User.class));
    }

    // ─── Login ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("should login user when valid credentials")
    void should_loginUser_when_validCredentials() {
        // Arrange
        var request = new LoginRequest("test@example.com", "Password1!");
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(testUserDetails);
        when(jwtService.generateAccessToken(testUserDetails)).thenReturn("access-token");
        when(jwtService.generateRefreshToken(testUserDetails)).thenReturn("refresh-token");
        when(jwtService.getAccessExpirationMs()).thenReturn(900_000L);

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.refreshToken()).isEqualTo("refresh-token");
        assertThat(response.expiresIn()).isEqualTo(900_000L);

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("test@example.com", "Password1!")
        );
    }

    @Test
    @DisplayName("should throw InvalidCredentialsException when bad password")
    void should_throwInvalidCredentialsException_when_badPassword() {
        // Arrange
        var request = new LoginRequest("test@example.com", "wrongPassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(jwtService, never()).generateAccessToken(any());
    }

    // ─── Refresh ────────────────────────────────────────────────────────

    @Test
    @DisplayName("should refresh token when valid refresh token")
    void should_refreshToken_when_validRefreshToken() {
        // Arrange
        var request = new RefreshTokenRequest("valid-refresh-token");
        when(jwtService.extractEmail("valid-refresh-token")).thenReturn("test@example.com");
        when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(testUserDetails);
        when(jwtService.isTokenValid("valid-refresh-token", testUserDetails)).thenReturn(true);
        when(jwtService.generateAccessToken(testUserDetails)).thenReturn("new-access-token");
        when(jwtService.generateRefreshToken(testUserDetails)).thenReturn("new-refresh-token");
        when(jwtService.getAccessExpirationMs()).thenReturn(900_000L);

        // Act
        AuthResponse response = authService.refresh(request);

        // Assert
        assertThat(response.accessToken()).isEqualTo("new-access-token");
        assertThat(response.refreshToken()).isEqualTo("new-refresh-token");
        assertThat(response.expiresIn()).isEqualTo(900_000L);

        verify(jwtService).isTokenValid("valid-refresh-token", testUserDetails);
    }

    // ─── Get Current User ───────────────────────────────────────────────

    @Test
    @DisplayName("should return current user when authenticated")
    void should_returnCurrentUser_when_authenticated() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // Act
        UserResponse response = authService.getCurrentUser("test@example.com");

        // Assert
        assertThat(response.email()).isEqualTo("test@example.com");
        assertThat(response.firstName()).isEqualTo("John");
        assertThat(response.lastName()).isEqualTo("Doe");
        assertThat(response.role()).isEqualTo("USER");
        assertThat(response.id()).isEqualTo(testUser.getId());

        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    @DisplayName("should throw ResourceNotFoundException when user not found")
    void should_throwResourceNotFoundException_when_userNotFound() {
        // Arrange
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> authService.getCurrentUser("unknown@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User")
                .hasMessageContaining("unknown@example.com");

        verify(userRepository).findByEmail("unknown@example.com");
    }
}
