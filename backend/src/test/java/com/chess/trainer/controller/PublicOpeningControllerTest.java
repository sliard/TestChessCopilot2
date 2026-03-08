package com.chess.trainer.controller;

import com.chess.trainer.config.SecurityConfig;
import com.chess.trainer.dto.response.OpeningListItemResponse;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.exception.GlobalExceptionHandler;
import com.chess.trainer.security.CustomUserDetailsService;
import com.chess.trainer.security.JwtAuthenticationFilter;
import com.chess.trainer.security.JwtService;
import com.chess.trainer.service.PublicOpeningService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
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

@WebMvcTest(PublicOpeningController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class PublicOpeningControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PublicOpeningService publicOpeningService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private static final String BASE_URL = "/api/v1/public/openings";

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

    // ─── Helpers ─────────────────────────────────────────────────────────

    private OpeningListItemResponse createSampleItem(String name, String ecoCode) {
        return new OpeningListItemResponse(
                UUID.randomUUID(),
                name,
                "A chess opening",
                ecoCode,
                2,
                "Author",
                Instant.now()
        );
    }

    private PageResponse<OpeningListItemResponse> createSamplePageResponse(
            List<OpeningListItemResponse> items) {
        return new PageResponse<>(items, 0, 20, items.size(), 1);
    }

    private PageResponse<OpeningListItemResponse> createEmptyPageResponse() {
        return new PageResponse<>(Collections.emptyList(), 0, 20, 0, 0);
    }

    // ─── GET /api/v1/public/openings ─────────────────────────────────────

    @Test
    @DisplayName("should_returnOpenings_when_noFiltersProvided")
    void should_returnOpenings_when_noFiltersProvided() throws Exception {
        // Arrange
        var items = List.of(
                createSampleItem("Sicilian Defense", "B20"),
                createSampleItem("French Defense", "C00")
        );
        when(publicOpeningService.searchPublicOpenings(
                isNull(), isNull(), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20)))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.content[1].name").value("French Defense"))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20));

        verify(publicOpeningService).searchPublicOpenings(
                isNull(), isNull(), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20));
    }

    @Test
    @DisplayName("should_searchByName_when_queryProvided")
    void should_searchByName_when_queryProvided() throws Exception {
        // Arrange
        var items = List.of(createSampleItem("Sicilian Defense", "B20"));
        when(publicOpeningService.searchPublicOpenings(
                eq("sicil"), isNull(), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20)))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("q", "sicil"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(publicOpeningService).searchPublicOpenings(
                eq("sicil"), isNull(), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20));
    }

    @Test
    @DisplayName("should_filterByEcoCode_when_ecoCodeProvided")
    void should_filterByEcoCode_when_ecoCodeProvided() throws Exception {
        // Arrange
        var items = List.of(createSampleItem("Sicilian Defense", "B20"));
        when(publicOpeningService.searchPublicOpenings(
                isNull(), eq("B20"), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20)))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("ecoCode", "B20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].ecoCode").value("B20"));

        verify(publicOpeningService).searchPublicOpenings(
                isNull(), eq("B20"), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20));
    }

    @Test
    @DisplayName("should_filterByMoves_when_movesProvided")
    void should_filterByMoves_when_movesProvided() throws Exception {
        // Arrange
        var items = List.of(createSampleItem("Sicilian Defense", "B20"));
        when(publicOpeningService.searchPublicOpenings(
                isNull(), isNull(), eq("1.e4 c5"),
                eq("createdAt"), eq("desc"), eq(0), eq(20)))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("moves", "1.e4 c5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"));

        verify(publicOpeningService).searchPublicOpenings(
                isNull(), isNull(), eq("1.e4 c5"),
                eq("createdAt"), eq("desc"), eq(0), eq(20));
    }

    @Test
    @DisplayName("should_combineMultipleFilters_when_queryAndEcoCodeProvided")
    void should_combineMultipleFilters_when_queryAndEcoCodeProvided() throws Exception {
        // Arrange
        var items = List.of(createSampleItem("Sicilian Defense", "B20"));
        when(publicOpeningService.searchPublicOpenings(
                eq("sicil"), eq("B20"), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20)))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL)
                        .param("q", "sicil")
                        .param("ecoCode", "B20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.content[0].ecoCode").value("B20"));

        verify(publicOpeningService).searchPublicOpenings(
                eq("sicil"), eq("B20"), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20));
    }

    @Test
    @DisplayName("should_sortByName_when_sortAndOrderProvided")
    void should_sortByName_when_sortAndOrderProvided() throws Exception {
        // Arrange
        var items = List.of(
                createSampleItem("French Defense", "C00"),
                createSampleItem("Sicilian Defense", "B20")
        );
        when(publicOpeningService.searchPublicOpenings(
                isNull(), isNull(), isNull(),
                eq("name"), eq("asc"), eq(0), eq(20)))
                .thenReturn(createSamplePageResponse(items));

        // Act & Assert
        mockMvc.perform(get(BASE_URL)
                        .param("sort", "name")
                        .param("order", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].name").value("French Defense"))
                .andExpect(jsonPath("$.content[1].name").value("Sicilian Defense"));

        verify(publicOpeningService).searchPublicOpenings(
                isNull(), isNull(), isNull(),
                eq("name"), eq("asc"), eq(0), eq(20));
    }

    @Test
    @DisplayName("should_returnEmptyPage_when_noResults")
    void should_returnEmptyPage_when_noResults() throws Exception {
        // Arrange
        when(publicOpeningService.searchPublicOpenings(
                eq("nonexistent"), isNull(), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20)))
                .thenReturn(createEmptyPageResponse());

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("q", "nonexistent"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(0))
                .andExpect(jsonPath("$.totalElements").value(0))
                .andExpect(jsonPath("$.totalPages").value(0));

        verify(publicOpeningService).searchPublicOpenings(
                eq("nonexistent"), isNull(), isNull(),
                eq("createdAt"), eq("desc"), eq(0), eq(20));
    }
}
