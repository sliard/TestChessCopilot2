package com.chess.trainer.controller;

import com.chess.trainer.config.SecurityConfig;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.dto.response.UserOpeningListItemResponse;
import com.chess.trainer.entity.Role;
import com.chess.trainer.entity.User;
import com.chess.trainer.exception.GlobalExceptionHandler;
import com.chess.trainer.repository.UserRepository;
import com.chess.trainer.security.CustomUserDetailsService;
import com.chess.trainer.security.JwtAuthenticationFilter;
import com.chess.trainer.security.JwtService;
import com.chess.trainer.service.UserOpeningService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserOpeningController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class UserOpeningControllerSearchTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserOpeningService userOpeningService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final String BASE_URL = "/api/v1/openings";
    private static final UUID USER_ID = UUID.randomUUID();
    private static final String USER_EMAIL = "test@example.com";

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

        // Mock resolveUserId: UserRepository.findByEmail returns a User with our USER_ID
        User user = User.builder()
                .id(USER_ID)
                .email(USER_EMAIL)
                .password("encoded-password")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        when(userRepository.findByEmail(USER_EMAIL)).thenReturn(Optional.of(user));
    }

    // ─── Helpers ─────────────────────────────────────────────────────────

    private UserOpeningListItemResponse createSampleItem(
            String name, String ecoCode, Boolean isPublic) {
        return new UserOpeningListItemResponse(
                UUID.randomUUID(),
                name,
                "A chess opening",
                ecoCode,
                2,
                isPublic,
                Instant.now(),
                Instant.now()
        );
    }

    private PageResponse<UserOpeningListItemResponse> createSamplePageResponse(
            List<UserOpeningListItemResponse> items) {
        return new PageResponse<>(items, 0, 20, items.size(), 1);
    }

    private PageResponse<UserOpeningListItemResponse> createEmptyPageResponse() {
        return new PageResponse<>(Collections.emptyList(), 0, 20, 0, 0);
    }

    // ─── GET /api/v1/openings (search) ───────────────────────────────────

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_returnOpenings_when_authenticated")
    void should_returnOpenings_when_authenticated() throws Exception {
        // Arrange
        var items = List.of(
                createSampleItem("Sicilian Defense", "B20", false),
                createSampleItem("French Defense", "C00", true)
        );
        when(userOpeningService.getUserOpenings(eq(USER_ID), any(), any(), any(), any(), any()))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.content[0].ecoCode").value("B20"))
                .andExpect(jsonPath("$.content[1].name").value("French Defense"))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20));

        verify(userOpeningService).getUserOpenings(eq(USER_ID), any(), any(), any(), any(), any());
    }

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_filterByEcoCode_when_ecoCodeProvided")
    void should_filterByEcoCode_when_ecoCodeProvided() throws Exception {
        // Arrange
        var items = List.of(createSampleItem("Sicilian Defense", "B20", false));
        when(userOpeningService.getUserOpenings(
                eq(USER_ID), isNull(), eq("B20"), isNull(), isNull(), any()))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("ecoCode", "B20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].ecoCode").value("B20"));

        verify(userOpeningService).getUserOpenings(
                eq(USER_ID), isNull(), eq("B20"), isNull(), isNull(), any());
    }

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_filterByVisibility_when_visibilityProvided")
    void should_filterByVisibility_when_visibilityProvided() throws Exception {
        // Arrange
        var items = List.of(createSampleItem("Sicilian Defense", "B20", false));
        when(userOpeningService.getUserOpenings(
                eq(USER_ID), isNull(), isNull(), isNull(), eq("private"), any()))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("visibility", "private"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].isPublic").value(false));

        verify(userOpeningService).getUserOpenings(
                eq(USER_ID), isNull(), isNull(), isNull(), eq("private"), any());
    }

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_combineSearchAndFilters_when_multipleParamsProvided")
    void should_combineSearchAndFilters_when_multipleParamsProvided() throws Exception {
        // Arrange
        var items = List.of(createSampleItem("Sicilian Defense", "B20", false));
        when(userOpeningService.getUserOpenings(
                eq(USER_ID), eq("sicil"), eq("B20"), eq("1.e4"), isNull(), any()))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL)
                        .param("q", "sicil")
                        .param("ecoCode", "B20")
                        .param("moves", "1.e4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.content[0].ecoCode").value("B20"));

        verify(userOpeningService).getUserOpenings(
                eq(USER_ID), eq("sicil"), eq("B20"), eq("1.e4"), isNull(), any());
    }

    @Test
    @DisplayName("should_return401_when_notAuthenticated")
    void should_return401_when_notAuthenticated() throws Exception {
        // Arrange — no @WithMockUser, no authentication context

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isForbidden());
    }
}
