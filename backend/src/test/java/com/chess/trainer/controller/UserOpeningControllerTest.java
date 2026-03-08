package com.chess.trainer.controller;

import com.chess.trainer.config.SecurityConfig;
import com.chess.trainer.dto.request.CreateOpeningRequest;
import com.chess.trainer.dto.request.UpdateOpeningRequest;
import com.chess.trainer.dto.request.UpdateVisibilityRequest;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.dto.response.UserOpeningListItemResponse;
import com.chess.trainer.dto.response.UserOpeningResponse;
import com.chess.trainer.entity.Role;
import com.chess.trainer.entity.User;
import com.chess.trainer.exception.GlobalExceptionHandler;
import com.chess.trainer.exception.ResourceNotFoundException;
import com.chess.trainer.repository.UserRepository;
import com.chess.trainer.security.CustomUserDetailsService;
import com.chess.trainer.security.JwtAuthenticationFilter;
import com.chess.trainer.security.JwtService;
import com.chess.trainer.service.UserOpeningService;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserOpeningController.class)
@Import({SecurityConfig.class, GlobalExceptionHandler.class})
class UserOpeningControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
    private static final UUID OPENING_ID = UUID.randomUUID();
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

    private UserOpeningResponse createSampleResponse() {
        return new UserOpeningResponse(
                OPENING_ID,
                "Sicilian Defense",
                "A popular opening",
                "B20",
                "1. e4 c5",
                2,
                false,
                "John Doe",
                Instant.now(),
                Instant.now()
        );
    }

    private PageResponse<UserOpeningListItemResponse> createSamplePageResponse() {
        var item = new UserOpeningListItemResponse(
                OPENING_ID,
                "Sicilian Defense",
                "A popular opening",
                "B20",
                2,
                false,
                Instant.now(),
                Instant.now()
        );
        return new PageResponse<>(List.of(item), 0, 20, 1, 1);
    }

    // ─── GET /api/v1/openings ────────────────────────────────────────────

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_returnOpenings_when_authenticated")
    void should_returnOpenings_when_authenticated() throws Exception {
        // Arrange
        when(userOpeningService.getUserOpenings(eq(USER_ID), any(), any()))
                .thenReturn(createSamplePageResponse());

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.content[0].ecoCode").value("B20"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(userOpeningService).getUserOpenings(eq(USER_ID), any(), any());
    }

    @Test
    @DisplayName("should_return401_when_notAuthenticated")
    void should_return401_when_notAuthenticated() throws Exception {
        // Arrange — no @WithMockUser, no authentication context

        // Act & Assert
        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isForbidden());
    }

    // ─── POST /api/v1/openings ───────────────────────────────────────────

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_return201_when_creatingValidOpening")
    void should_return201_when_creatingValidOpening() throws Exception {
        // Arrange
        var request = new CreateOpeningRequest("Sicilian Defense", "A popular opening", "B20", "1. e4 c5", false);
        when(userOpeningService.createOpening(eq(USER_ID), any(CreateOpeningRequest.class)))
                .thenReturn(createSampleResponse());

        // Act & Assert
        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.ecoCode").value("B20"))
                .andExpect(jsonPath("$.authorName").value("John Doe"));

        verify(userOpeningService).createOpening(eq(USER_ID), any(CreateOpeningRequest.class));
    }

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_return400_when_nameIsBlank")
    void should_return400_when_nameIsBlank() throws Exception {
        // Arrange — blank name violates @NotBlank
        var request = new CreateOpeningRequest("", "desc", "B20", "1. e4 c5", false);

        // Act & Assert
        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_return400_when_movesIsBlank")
    void should_return400_when_movesIsBlank() throws Exception {
        // Arrange — blank moves violates @NotBlank
        var request = new CreateOpeningRequest("Sicilian", "desc", "B20", "", false);

        // Act & Assert
        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_return400_when_isPublicIsNull")
    void should_return400_when_isPublicIsNull() throws Exception {
        // Arrange — null isPublic violates @NotNull; construct JSON manually
        String json = """
                {
                    "name": "Sicilian",
                    "description": "desc",
                    "ecoCode": "B20",
                    "moves": "1. e4 c5",
                    "isPublic": null
                }
                """;

        // Act & Assert
        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest());
    }

    // ─── GET /api/v1/openings/{id} ───────────────────────────────────────

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_returnOpening_when_getById")
    void should_returnOpening_when_getById() throws Exception {
        // Arrange
        when(userOpeningService.getOpening(USER_ID, OPENING_ID)).thenReturn(createSampleResponse());

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/{id}", OPENING_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(OPENING_ID.toString()))
                .andExpect(jsonPath("$.name").value("Sicilian Defense"))
                .andExpect(jsonPath("$.moves").value("1. e4 c5"))
                .andExpect(jsonPath("$.movesCount").value(2));

        verify(userOpeningService).getOpening(USER_ID, OPENING_ID);
    }

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_return404_when_openingNotFound")
    void should_return404_when_openingNotFound() throws Exception {
        // Arrange
        UUID nonExistentId = UUID.randomUUID();
        when(userOpeningService.getOpening(USER_ID, nonExistentId))
                .thenThrow(new ResourceNotFoundException("Opening", "id", nonExistentId));

        // Act & Assert
        mockMvc.perform(get(BASE_URL + "/{id}", nonExistentId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Opening not found with id: " + nonExistentId));
    }

    // ─── PUT /api/v1/openings/{id} ───────────────────────────────────────

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_updateOpening_when_validRequest")
    void should_updateOpening_when_validRequest() throws Exception {
        // Arrange
        var request = new UpdateOpeningRequest("Updated Name", "Updated desc", "C00", "1. d4 d5", true);
        var response = new UserOpeningResponse(
                OPENING_ID, "Updated Name", "Updated desc", "C00", "1. d4 d5", 2, true,
                "John Doe", Instant.now(), Instant.now()
        );
        when(userOpeningService.updateOpening(eq(USER_ID), eq(OPENING_ID), any(UpdateOpeningRequest.class)))
                .thenReturn(response);

        // Act & Assert
        mockMvc.perform(put(BASE_URL + "/{id}", OPENING_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"))
                .andExpect(jsonPath("$.description").value("Updated desc"))
                .andExpect(jsonPath("$.isPublic").value(true));

        verify(userOpeningService).updateOpening(eq(USER_ID), eq(OPENING_ID), any(UpdateOpeningRequest.class));
    }

    // ─── DELETE /api/v1/openings/{id} ────────────────────────────────────

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_deleteOpening_when_owned")
    void should_deleteOpening_when_owned() throws Exception {
        // Arrange
        doNothing().when(userOpeningService).deleteOpening(USER_ID, OPENING_ID);

        // Act & Assert
        mockMvc.perform(delete(BASE_URL + "/{id}", OPENING_ID))
                .andExpect(status().isNoContent());

        verify(userOpeningService).deleteOpening(USER_ID, OPENING_ID);
    }

    // ─── PATCH /api/v1/openings/{id}/visibility ──────────────────────────

    @Test
    @WithMockUser(username = USER_EMAIL)
    @DisplayName("should_updateVisibility_when_validRequest")
    void should_updateVisibility_when_validRequest() throws Exception {
        // Arrange
        var request = new UpdateVisibilityRequest(true);
        var response = new UserOpeningResponse(
                OPENING_ID, "Sicilian Defense", "A popular opening", "B20", "1. e4 c5", 2, true,
                "John Doe", Instant.now(), Instant.now()
        );
        when(userOpeningService.updateVisibility(eq(USER_ID), eq(OPENING_ID), any(UpdateVisibilityRequest.class)))
                .thenReturn(response);

        // Act & Assert
        mockMvc.perform(patch(BASE_URL + "/{id}/visibility", OPENING_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isPublic").value(true));

        verify(userOpeningService).updateVisibility(eq(USER_ID), eq(OPENING_ID), any(UpdateVisibilityRequest.class));
    }
}
