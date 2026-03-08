package com.chess.trainer.controller;

import com.chess.trainer.config.SecurityConfig;
import com.chess.trainer.dto.request.LoginRequest;
import com.chess.trainer.dto.request.RefreshTokenRequest;
import com.chess.trainer.dto.request.RegisterRequest;
import com.chess.trainer.dto.response.AuthResponse;
import com.chess.trainer.dto.response.UserResponse;
import com.chess.trainer.exception.EmailAlreadyExistsException;
import com.chess.trainer.exception.GlobalExceptionHandler;
import com.chess.trainer.exception.InvalidCredentialsException;
import com.chess.trainer.security.CustomUserDetailsService;
import com.chess.trainer.security.JwtAuthenticationFilter;
import com.chess.trainer.security.JwtService;
import com.chess.trainer.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final String BASE_URL = "/api/v1/auth";

    @BeforeEach
    void setUp() throws Exception {
        // Configure the mocked JwtAuthenticationFilter to pass through to the next filter
        doAnswer(invocation -> {
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(
                    invocation.getArgument(0, HttpServletRequest.class),
                    invocation.getArgument(1, HttpServletResponse.class)
            );
            return null;
        }).when(jwtAuthenticationFilter)
                .doFilter(any(HttpServletRequest.class), any(HttpServletResponse.class), any(FilterChain.class));
    }

    // ─── Register ───────────────────────────────────────────────────────

    @Test
    @DisplayName("should return 201 Created when register with valid data")
    void should_returnCreated_when_registerWithValidData() throws Exception {
        // Arrange
        var request = new RegisterRequest("test@example.com", "Password1!", "John", "Doe");
        var response = new AuthResponse("access-token", "refresh-token", 900_000L);
        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post(BASE_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.expiresIn").value(900_000));

        verify(authService).register(any(RegisterRequest.class));
    }

    @Test
    @DisplayName("should return 400 Bad Request when register with invalid email")
    void should_returnBadRequest_when_registerWithInvalidEmail() throws Exception {
        // Arrange — invalid email format
        var request = new RegisterRequest("not-an-email", "Password1!", "John", "Doe");

        // Act & Assert
        mockMvc.perform(post(BASE_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("should return 409 Conflict when register with existing email")
    void should_returnConflict_when_registerWithExistingEmail() throws Exception {
        // Arrange
        var request = new RegisterRequest("taken@example.com", "Password1!", "John", "Doe");
        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new EmailAlreadyExistsException("taken@example.com"));

        // Act & Assert
        mockMvc.perform(post(BASE_URL + "/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email already registered: taken@example.com"));
    }

    // ─── Login ──────────────────────────────────────────────────────────

    @Test
    @DisplayName("should return 200 OK when login with valid credentials")
    void should_returnOk_when_loginWithValidCredentials() throws Exception {
        // Arrange
        var request = new LoginRequest("test@example.com", "Password1!");
        var response = new AuthResponse("access-token", "refresh-token", 900_000L);
        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.expiresIn").value(900_000));

        verify(authService).login(any(LoginRequest.class));
    }

    @Test
    @DisplayName("should return 401 Unauthorized when login with bad credentials")
    void should_returnUnauthorized_when_loginWithBadCredentials() throws Exception {
        // Arrange
        var request = new LoginRequest("test@example.com", "wrongPassword");
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new InvalidCredentialsException());

        // Act & Assert
        mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }

    // ─── Refresh ────────────────────────────────────────────────────────

    @Test
    @DisplayName("should return 200 OK when refresh with valid token")
    void should_returnOk_when_refreshWithValidToken() throws Exception {
        // Arrange
        var request = new RefreshTokenRequest("valid-refresh-token");
        var response = new AuthResponse("new-access-token", "new-refresh-token", 900_000L);
        when(authService.refresh(any(RefreshTokenRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post(BASE_URL + "/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.refreshToken").value("new-refresh-token"));

        verify(authService).refresh(any(RefreshTokenRequest.class));
    }

    // ─── Me (Get Current User) ──────────────────────────────────────────

    @Test
    @WithMockUser(username = "test@example.com")
    @DisplayName("should return user profile when authenticated GET /me")
    void should_returnUserProfile_when_authenticatedGetMe() throws Exception {
        // Arrange
        var userResponse = new UserResponse(
                UUID.randomUUID(), "test@example.com", "John", "Doe", "USER", Instant.now()
        );
        when(authService.getCurrentUser("test@example.com")).thenReturn(userResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.role").value("USER"));

        verify(authService).getCurrentUser("test@example.com");
    }

    @Test
    @DisplayName("should return 403 Forbidden when unauthenticated GET /me")
    void should_returnForbidden_when_unauthenticatedGetMe() throws Exception {
        // Arrange — no authentication context

        // Act & Assert
        // Without @WithMockUser, SecurityConfig denies access to /api/v1/auth/me
        mockMvc.perform(get(BASE_URL + "/me"))
                .andExpect(status().isForbidden());
    }
}
