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
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
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

    // ========== Filter & Sort params ==========

    @Test
    void should_acceptEcoCodeFilter_when_provided() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.searchPublicOpenings(isNull(), eq("B20"), isNull(), any(Pageable.class)))
                .thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("ecoCode", "B20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        verify(publicOpeningService).searchPublicOpenings(isNull(), eq("B20"), isNull(), any(Pageable.class));
    }

    @Test
    void should_acceptMovesFilter_when_provided() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.searchPublicOpenings(isNull(), isNull(), eq("1.e4"), any(Pageable.class)))
                .thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("moves", "1.e4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        verify(publicOpeningService).searchPublicOpenings(isNull(), isNull(), eq("1.e4"), any(Pageable.class));
    }

    @Test
    void should_acceptCombinedFilters_when_provided() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.searchPublicOpenings(eq("Sicilian"), eq("B20"), eq("1.e4"), any(Pageable.class)))
                .thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL)
                        .param("q", "Sicilian")
                        .param("ecoCode", "B20")
                        .param("moves", "1.e4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        verify(publicOpeningService).searchPublicOpenings(eq("Sicilian"), eq("B20"), eq("1.e4"), any(Pageable.class));
    }

    @Test
    void should_acceptSortParams_when_provided() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.getPublicOpenings(any(Pageable.class))).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL)
                        .param("sort", "name")
                        .param("order", "asc"))
                .andExpect(status().isOk());

        // Capture the Pageable to verify sort configuration
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(publicOpeningService).getPublicOpenings(pageableCaptor.capture());
        Pageable captured = pageableCaptor.getValue();
        assertThat(captured.getSort().getOrderFor("name")).isNotNull();
        assertThat(captured.getSort().getOrderFor("name").getDirection()).isEqualTo(Sort.Direction.ASC);
    }

    @Test
    void should_fallbackToDefaultSort_when_invalidSortField() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.getPublicOpenings(any(Pageable.class))).thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL).param("sort", "invalid"))
                .andExpect(status().isOk());

        // Capture the Pageable to verify fallback to createdAt
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(publicOpeningService).getPublicOpenings(pageableCaptor.capture());
        Pageable captured = pageableCaptor.getValue();
        assertThat(captured.getSort().getOrderFor("createdAt")).isNotNull();
        assertThat(captured.getSort().getOrderFor("createdAt").getDirection()).isEqualTo(Sort.Direction.DESC);
    }

    @Test
    void should_acceptAllSearchFilters_when_searchEndpoint() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.searchPublicOpenings(eq("test"), eq("B"), eq("1.e4"), any(Pageable.class)))
                .thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/search")
                        .param("q", "test")
                        .param("ecoCode", "B")
                        .param("moves", "1.e4")
                        .param("sort", "name")
                        .param("order", "asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // Verify 4-arg service method called with correct params
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(publicOpeningService).searchPublicOpenings(eq("test"), eq("B"), eq("1.e4"), pageableCaptor.capture());
        Pageable captured = pageableCaptor.getValue();
        assertThat(captured.getSort().getOrderFor("name")).isNotNull();
        assertThat(captured.getSort().getOrderFor("name").getDirection()).isEqualTo(Sort.Direction.ASC);
    }

    @Test
    void should_delegateToLegacySearch_when_noExtraFilters() throws Exception {
        // Arrange
        var pageResponse = new PageResponse<OpeningListItemResponse>(List.of(), 0, 20, 0, 0, true, true);
        when(publicOpeningService.searchPublicOpenings(eq("test"), any(Pageable.class)))
                .thenReturn(pageResponse);

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/search").param("q", "test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // Verify 2-arg (legacy) search method is called, not the 4-arg overload
        verify(publicOpeningService).searchPublicOpenings(eq("test"), any(Pageable.class));
    }
}
