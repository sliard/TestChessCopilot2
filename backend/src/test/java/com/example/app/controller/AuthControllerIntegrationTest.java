package com.example.app.controller;

import com.example.app.config.SecurityConfig;
import com.example.app.dto.*;
import com.example.app.repository.UserRepository;
import com.example.app.security.JwtAuthenticationFilter;
import com.example.app.security.JwtService;
import com.example.app.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
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
    private UserRepository userRepository;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private static final String REGISTER_URL = "/api/v1/auth/register";
    private static final String LOGIN_URL = "/api/v1/auth/login";
    private static final String REFRESH_URL = "/api/v1/auth/refresh";
    private static final String LOGOUT_URL = "/api/v1/auth/logout";
    private static final String ME_URL = "/api/v1/auth/me";

    // ========== Register ==========

    @Test
    void should_register_and_return201_when_validRequest() throws Exception {
        // Arrange
        var request = new RegisterRequest("test@example.com", "Password1", "John", "Doe");
        var response = new AuthResponse("access-token", "refresh-token", 900000L);
        when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.expiresIn").value(900000));

        verify(authService).register(any(RegisterRequest.class));
    }

    @Test
    void should_return400_when_registrationWithInvalidEmail() throws Exception {
        // Arrange
        var request = new RegisterRequest("not-an-email", "Password1", "John", "Doe");

        // Act & Assert
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));

        verifyNoInteractions(authService);
    }

    @Test
    void should_return400_when_registrationWithWeakPassword() throws Exception {
        // Arrange
        var request = new RegisterRequest("test@example.com", "short", "John", "Doe");

        // Act & Assert
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));

        verifyNoInteractions(authService);
    }

    @Test
    void should_return400_when_registrationWithMissingFields() throws Exception {
        // Act & Assert
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));

        verifyNoInteractions(authService);
    }

    // ========== Login ==========

    @Test
    void should_login_and_return200_when_validCredentials() throws Exception {
        // Arrange
        var request = new LoginRequest("test@example.com", "Password1");
        var response = new AuthResponse("access-token", "refresh-token", 900000L);
        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access-token"))
                .andExpect(jsonPath("$.refreshToken").value("refresh-token"))
                .andExpect(jsonPath("$.expiresIn").value(900000));

        verify(authService).login(any(LoginRequest.class));
    }

    @Test
    void should_return401_when_badCredentials() throws Exception {
        // Arrange
        var request = new LoginRequest("test@example.com", "wrongPassword");
        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("UNAUTHORIZED"));

        verify(authService).login(any(LoginRequest.class));
    }

    // ========== Refresh Token ==========

    @Test
    void should_refreshToken_and_return200_when_validToken() throws Exception {
        // Arrange
        var request = new RefreshTokenRequest("valid-refresh-token");
        var response = new AuthResponse("new-access-token", "new-refresh-token", 900000L);
        when(authService.refreshToken(any(RefreshTokenRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post(REFRESH_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("new-access-token"))
                .andExpect(jsonPath("$.refreshToken").value("new-refresh-token"))
                .andExpect(jsonPath("$.expiresIn").value(900000));

        verify(authService).refreshToken(any(RefreshTokenRequest.class));
    }

    @Test
    void should_return400_when_invalidRefreshToken() throws Exception {
        // Arrange
        var request = new RefreshTokenRequest("invalid-refresh-token");
        when(authService.refreshToken(any(RefreshTokenRequest.class)))
                .thenThrow(new IllegalArgumentException("Refresh token invalide"));

        // Act & Assert
        mockMvc.perform(post(REFRESH_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("BAD_REQUEST"));

        verify(authService).refreshToken(any(RefreshTokenRequest.class));
    }

    // ========== Logout ==========

    @Test
    @WithMockUser(username = "test@example.com")
    void should_logout_and_return204_when_authenticated() throws Exception {
        // Arrange
        doNothing().when(authService).logout("test@example.com");

        // Act & Assert
        mockMvc.perform(post(LOGOUT_URL))
                .andExpect(status().isNoContent());

        verify(authService).logout("test@example.com");
    }

    @Test
    void should_return403_when_logoutUnauthenticated() throws Exception {
        // Act & Assert
        mockMvc.perform(post(LOGOUT_URL))
                .andExpect(status().isForbidden());
    }

    // ========== Get Current User ==========

    @Test
    @WithMockUser(username = "test@example.com")
    void should_getMe_and_return200_when_authenticated() throws Exception {
        // Arrange
        var userResponse = new UserResponse(
                UUID.randomUUID(), "test@example.com", "John", "Doe", "USER"
        );
        when(authService.getCurrentUser("test@example.com")).thenReturn(userResponse);

        // Act & Assert
        mockMvc.perform(get(ME_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.role").value("USER"));

        verify(authService).getCurrentUser("test@example.com");
    }

    @Test
    void should_return403_when_getMeUnauthenticated() throws Exception {
        // Act & Assert
        mockMvc.perform(get(ME_URL))
                .andExpect(status().isForbidden());
    }
}
