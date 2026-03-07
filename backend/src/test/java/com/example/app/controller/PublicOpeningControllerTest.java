package com.example.app.controller;

import com.example.app.config.SecurityConfig;
import com.example.app.dto.OpeningDetailResponse;
import com.example.app.dto.OpeningListItemResponse;
import com.example.app.dto.PageResponse;
import com.example.app.repository.UserRepository;
import com.example.app.security.JwtAuthenticationFilter;
import com.example.app.security.JwtService;
import com.example.app.service.PublicOpeningService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicOpeningController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
class PublicOpeningControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PublicOpeningService publicOpeningService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserDetailsService userDetailsService;

    private static final String BASE_URL = "/api/v1/public/openings";

    // ========== GET /api/v1/public/openings ==========

    @Test
    void should_returnOpeningsList_when_getPublicOpenings() throws Exception {
        // Arrange
        var opening = new OpeningListItemResponse(
                UUID.randomUUID(), "Sicilian Defense", "A sharp opening",
                "B20", 3, "John Doe", Instant.now()
        );
        var pageResponse = new PageResponse<>(List.of(opening), 0, 20, 1, 1, true, true);
        when(publicOpeningService.getPublicOpenings(any())).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.content[0].ecoCode").value("B20"))
                .andExpect(jsonPath("$.content[0].movesCount").value(3))
                .andExpect(jsonPath("$.content[0].author").value("John Doe"))
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.last").value(true));

        verify(publicOpeningService).getPublicOpenings(any());
    }

    @Test
    void should_returnEmptyList_when_noPublicOpenings() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.getPublicOpenings(any())).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(0))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    // ========== GET /api/v1/public/openings/{id} ==========

    @Test
    void should_returnOpeningDetail_when_getPublicOpening() throws Exception {
        // Arrange
        UUID id = UUID.randomUUID();
        var detail = new OpeningDetailResponse(
                id, "Sicilian Defense", "A sharp opening", "B20",
                "1.e4 c5 2.Nf3 d6 3.d4 cxd4", "John Doe",
                Instant.now(), Instant.now()
        );
        when(publicOpeningService.getPublicOpening(id)).thenReturn(detail);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.description").value("A sharp opening"))
                .andExpect(jsonPath("$.ecoCode").value("B20"))
                .andExpect(jsonPath("$.moves").value("1.e4 c5 2.Nf3 d6 3.d4 cxd4"))
                .andExpect(jsonPath("$.author").value("John Doe"));

        verify(publicOpeningService).getPublicOpening(id);
    }

    @Test
    void should_return404_when_openingNotFound() throws Exception {
        // Arrange
        UUID id = UUID.randomUUID();
        when(publicOpeningService.getPublicOpening(id))
                .thenThrow(new EntityNotFoundException("Ouverture non trouvée"));

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));

        verify(publicOpeningService).getPublicOpening(id);
    }

    @Test
    void should_return400_when_invalidUuidFormat() throws Exception {
        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/not-a-uuid"))
                .andExpect(status().isBadRequest());
    }

    // ========== GET /api/v1/public/openings/search ==========

    @Test
    void should_returnSearchResults_when_searchByName() throws Exception {
        // Arrange
        var opening = new OpeningListItemResponse(
                UUID.randomUUID(), "Sicilian Defense", "A sharp opening",
                "B20", 3, "John Doe", Instant.now()
        );
        var pageResponse = new PageResponse<>(List.of(opening), 0, 20, 1, 1, true, true);
        when(publicOpeningService.searchPublicOpenings(eq("Sicilian"), any())).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/search").param("q", "Sicilian"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(publicOpeningService).searchPublicOpenings(eq("Sicilian"), any());
    }

    @Test
    void should_returnEmptyResults_when_searchNoMatch() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.searchPublicOpenings(eq("xyz"), any())).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/search").param("q", "xyz"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(0))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    // ========== Pagination ==========

    @Test
    void should_acceptPaginationParams_when_provided() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 2, 10, 30, 3, false, true);
        when(publicOpeningService.getPublicOpenings(any())).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL)
                        .param("page", "2")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(2))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalElements").value(30))
                .andExpect(jsonPath("$.totalPages").value(3))
                .andExpect(jsonPath("$.first").value(false))
                .andExpect(jsonPath("$.last").value(true));

        verify(publicOpeningService).getPublicOpenings(any());
    }

    @Test
    void should_acceptSearchPaginationParams_when_provided() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 1, 5, 12, 3, false, false);
        when(publicOpeningService.searchPublicOpenings(eq("test"), any())).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/search")
                        .param("q", "test")
                        .param("page", "1")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.size").value(5))
                .andExpect(jsonPath("$.totalElements").value(12))
                .andExpect(jsonPath("$.totalPages").value(3));

        verify(publicOpeningService).searchPublicOpenings(eq("test"), any());
    }
}
