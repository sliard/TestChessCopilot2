package com.chess.trainer.service;

import com.chess.trainer.dto.request.CreateOpeningRequest;
import com.chess.trainer.dto.request.UpdateOpeningRequest;
import com.chess.trainer.dto.request.UpdateVisibilityRequest;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.dto.response.UserOpeningListItemResponse;
import com.chess.trainer.dto.response.UserOpeningResponse;
import com.chess.trainer.entity.Opening;
import com.chess.trainer.entity.Role;
import com.chess.trainer.entity.User;
import com.chess.trainer.exception.ResourceNotFoundException;
import com.chess.trainer.repository.OpeningRepository;
import com.chess.trainer.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserOpeningServiceImplTest {

    @Mock
    private OpeningRepository openingRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserOpeningServiceImpl userOpeningService;

    private static final UUID USER_ID = UUID.randomUUID();
    private static final UUID OPENING_ID = UUID.randomUUID();
    private static final Pageable DEFAULT_PAGEABLE = PageRequest.of(0, 20);

    // ─── Helpers ─────────────────────────────────────────────────────────

    private Opening createSampleOpening(UUID id, UUID userId) {
        return Opening.builder()
                .id(id)
                .name("Test Opening")
                .description("A test description")
                .ecoCode("B20")
                .moves("1. e4 c5")
                .isPublic(false)
                .userId(userId)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    private User createSampleUser(UUID userId) {
        return User.builder()
                .id(userId)
                .email("john@example.com")
                .password("encoded-password")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    // ─── getUserOpenings ─────────────────────────────────────────────────

    @Test
    @DisplayName("should_returnPageOfOpenings_when_userHasOpenings")
    void should_returnPageOfOpenings_when_userHasOpenings() {
        // Arrange
        Opening opening1 = createSampleOpening(UUID.randomUUID(), USER_ID);
        Opening opening2 = createSampleOpening(UUID.randomUUID(), USER_ID);
        opening2.setName("Ruy Lopez");
        opening2.setMoves("1. e4 e5 2. Nf3 Nc6 3. Bb5");

        Page<Opening> page = new PageImpl<>(List.of(opening1, opening2), DEFAULT_PAGEABLE, 2);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, null, null, null, null, DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).hasSize(2);
        assertThat(result.content().get(0).name()).isEqualTo("Test Opening");
        assertThat(result.content().get(0).movesCount()).isEqualTo(2);
        assertThat(result.content().get(1).name()).isEqualTo("Ruy Lopez");
        assertThat(result.content().get(1).movesCount()).isEqualTo(5);
        assertThat(result.totalElements()).isEqualTo(2);

        verify(openingRepository).searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_returnFilteredOpenings_when_searchQueryProvided")
    void should_returnFilteredOpenings_when_searchQueryProvided() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        Page<Opening> page = new PageImpl<>(List.of(opening), DEFAULT_PAGEABLE, 1);
        when(openingRepository.searchUserOpenings(eq(USER_ID), eq("Test"), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, "Test", null, null, null, DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).name()).isEqualTo("Test Opening");

        verify(openingRepository).searchUserOpenings(eq(USER_ID), eq("Test"), isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_returnEmptyPage_when_userHasNoOpenings")
    void should_returnEmptyPage_when_userHasNoOpenings() {
        // Arrange
        Page<Opening> emptyPage = new PageImpl<>(List.of(), DEFAULT_PAGEABLE, 0);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, null, null, null, null, DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).isEmpty();
        assertThat(result.totalElements()).isZero();
    }

    @Test
    @DisplayName("should_filterByEcoCode_when_ecoCodeProvided")
    void should_filterByEcoCode_when_ecoCodeProvided() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        opening.setEcoCode("B20");
        Page<Opening> page = new PageImpl<>(List.of(opening), DEFAULT_PAGEABLE, 1);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), eq("B20"), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, null, "B20", null, null, DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).ecoCode()).isEqualTo("B20");
        verify(openingRepository).searchUserOpenings(eq(USER_ID), isNull(), eq("B20"), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_filterByMoves_when_movesProvided")
    void should_filterByMoves_when_movesProvided() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        Page<Opening> page = new PageImpl<>(List.of(opening), DEFAULT_PAGEABLE, 1);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), isNull(), eq("1. e4 c5"), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, null, null, "1. e4 c5", null, DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).hasSize(1);
        verify(openingRepository).searchUserOpenings(eq(USER_ID), isNull(), isNull(), eq("1. e4 c5"), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_filterPublicOnly_when_visibilityIsPublic")
    void should_filterPublicOnly_when_visibilityIsPublic() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        opening.setIsPublic(true);
        Page<Opening> page = new PageImpl<>(List.of(opening), DEFAULT_PAGEABLE, 1);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), eq(true), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, null, null, null, "public", DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).isPublic()).isTrue();
        verify(openingRepository).searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), eq(true), any(Pageable.class));
    }

    @Test
    @DisplayName("should_filterPrivateOnly_when_visibilityIsPrivate")
    void should_filterPrivateOnly_when_visibilityIsPrivate() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        opening.setIsPublic(false);
        Page<Opening> page = new PageImpl<>(List.of(opening), DEFAULT_PAGEABLE, 1);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), eq(false), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, null, null, null, "private", DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).isPublic()).isFalse();
        verify(openingRepository).searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), eq(false), any(Pageable.class));
    }

    @Test
    @DisplayName("should_notFilterVisibility_when_visibilityIsAll")
    void should_notFilterVisibility_when_visibilityIsAll() {
        // Arrange
        Page<Opening> page = new PageImpl<>(List.of(), DEFAULT_PAGEABLE, 0);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        userOpeningService.getUserOpenings(USER_ID, null, null, null, "all", DEFAULT_PAGEABLE);

        // Assert — "all" resolves to null isPublic, meaning no visibility filter
        verify(openingRepository).searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_combineAllFilters_when_allProvided")
    void should_combineAllFilters_when_allProvided() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        opening.setIsPublic(true);
        Page<Opening> page = new PageImpl<>(List.of(opening), DEFAULT_PAGEABLE, 1);
        when(openingRepository.searchUserOpenings(
                eq(USER_ID), eq("Sicilian"), eq("B20"), eq("1. e4 c5"), eq(true), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<UserOpeningListItemResponse> result =
                userOpeningService.getUserOpenings(USER_ID, "Sicilian", "B20", "1. e4 c5", "public", DEFAULT_PAGEABLE);

        // Assert
        assertThat(result.content()).hasSize(1);
        verify(openingRepository).searchUserOpenings(
                eq(USER_ID), eq("Sicilian"), eq("B20"), eq("1. e4 c5"), eq(true), any(Pageable.class));
    }

    @Test
    @DisplayName("should_normalizeEmptyStringsToNull")
    void should_normalizeEmptyStringsToNull() {
        // Arrange
        Page<Opening> emptyPage = new PageImpl<>(List.of(), DEFAULT_PAGEABLE, 0);
        when(openingRepository.searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        userOpeningService.getUserOpenings(USER_ID, "", "  ", "   ", null, DEFAULT_PAGEABLE);

        // Assert — blank/empty strings must be normalized to null
        verify(openingRepository).searchUserOpenings(eq(USER_ID), isNull(), isNull(), isNull(), isNull(), any(Pageable.class));
    }

    // ─── createOpening ───────────────────────────────────────────────────

    @Test
    @DisplayName("should_createOpening_when_validRequest")
    void should_createOpening_when_validRequest() {
        // Arrange
        var request = new CreateOpeningRequest("Sicilian Defense", "A description", "B20", "1. e4 c5", false);
        Opening savedOpening = createSampleOpening(OPENING_ID, USER_ID);
        savedOpening.setName("Sicilian Defense");
        savedOpening.setMoves("1. e4 c5");

        when(openingRepository.save(any(Opening.class))).thenReturn(savedOpening);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(createSampleUser(USER_ID)));

        // Act
        UserOpeningResponse result = userOpeningService.createOpening(USER_ID, request);

        // Assert
        assertThat(result.name()).isEqualTo("Sicilian Defense");
        assertThat(result.authorName()).isEqualTo("John Doe");
        assertThat(result.movesCount()).isEqualTo(2);

        verify(openingRepository).save(any(Opening.class));
    }

    @Test
    @DisplayName("should_setUserIdOnCreation_when_creating")
    void should_setUserIdOnCreation_when_creating() {
        // Arrange
        var request = new CreateOpeningRequest("My Opening", "desc", "C00", "1. e4 e6", true);
        Opening savedOpening = createSampleOpening(OPENING_ID, USER_ID);
        when(openingRepository.save(any(Opening.class))).thenReturn(savedOpening);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(createSampleUser(USER_ID)));

        // Act
        userOpeningService.createOpening(USER_ID, request);

        // Assert — capture the entity passed to save() and verify userId
        ArgumentCaptor<Opening> captor = ArgumentCaptor.forClass(Opening.class);
        verify(openingRepository).save(captor.capture());
        Opening captured = captor.getValue();

        assertThat(captured.getUserId()).isEqualTo(USER_ID);
        assertThat(captured.getName()).isEqualTo("My Opening");
        assertThat(captured.getIsPublic()).isTrue();
    }

    // ─── getOpening ──────────────────────────────────────────────────────

    @Test
    @DisplayName("should_returnOpening_when_userIsOwner")
    void should_returnOpening_when_userIsOwner() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        when(openingRepository.findByIdAndUserId(OPENING_ID, USER_ID)).thenReturn(Optional.of(opening));
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(createSampleUser(USER_ID)));

        // Act
        UserOpeningResponse result = userOpeningService.getOpening(USER_ID, OPENING_ID);

        // Assert
        assertThat(result.id()).isEqualTo(OPENING_ID);
        assertThat(result.name()).isEqualTo("Test Opening");
        assertThat(result.authorName()).isEqualTo("John Doe");

        verify(openingRepository).findByIdAndUserId(OPENING_ID, USER_ID);
    }

    @Test
    @DisplayName("should_throwResourceNotFoundException_when_openingNotFound")
    void should_throwResourceNotFoundException_when_openingNotFound() {
        // Arrange
        when(openingRepository.findByIdAndUserId(OPENING_ID, USER_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userOpeningService.getOpening(USER_ID, OPENING_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Opening")
                .hasMessageContaining(OPENING_ID.toString());
    }

    // ─── updateOpening ───────────────────────────────────────────────────

    @Test
    @DisplayName("should_updateOpening_when_userIsOwner")
    void should_updateOpening_when_userIsOwner() {
        // Arrange
        Opening existing = createSampleOpening(OPENING_ID, USER_ID);
        var request = new UpdateOpeningRequest("Updated Name", "Updated desc", "C00", "1. d4 d5", true);

        Opening updated = createSampleOpening(OPENING_ID, USER_ID);
        updated.setName("Updated Name");
        updated.setDescription("Updated desc");
        updated.setEcoCode("C00");
        updated.setMoves("1. d4 d5");
        updated.setIsPublic(true);

        when(openingRepository.findByIdAndUserId(OPENING_ID, USER_ID)).thenReturn(Optional.of(existing));
        when(openingRepository.save(any(Opening.class))).thenReturn(updated);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(createSampleUser(USER_ID)));

        // Act
        UserOpeningResponse result = userOpeningService.updateOpening(USER_ID, OPENING_ID, request);

        // Assert
        assertThat(result.name()).isEqualTo("Updated Name");
        assertThat(result.description()).isEqualTo("Updated desc");
        assertThat(result.ecoCode()).isEqualTo("C00");
        assertThat(result.moves()).isEqualTo("1. d4 d5");
        assertThat(result.isPublic()).isTrue();

        verify(openingRepository).findByIdAndUserId(OPENING_ID, USER_ID);
        verify(openingRepository).save(any(Opening.class));
    }

    @Test
    @DisplayName("should_throwResourceNotFoundException_when_updatingOtherUsersOpening")
    void should_throwResourceNotFoundException_when_updatingOtherUsersOpening() {
        // Arrange
        var request = new UpdateOpeningRequest("Updated", "desc", "C00", "1. d4", true);
        when(openingRepository.findByIdAndUserId(OPENING_ID, USER_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userOpeningService.updateOpening(USER_ID, OPENING_ID, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Opening");
    }

    // ─── deleteOpening ───────────────────────────────────────────────────

    @Test
    @DisplayName("should_deleteOpening_when_userIsOwner")
    void should_deleteOpening_when_userIsOwner() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        when(openingRepository.findByIdAndUserId(OPENING_ID, USER_ID)).thenReturn(Optional.of(opening));

        // Act
        userOpeningService.deleteOpening(USER_ID, OPENING_ID);

        // Assert
        verify(openingRepository).findByIdAndUserId(OPENING_ID, USER_ID);
        verify(openingRepository).delete(opening);
    }

    @Test
    @DisplayName("should_throwResourceNotFoundException_when_deletingNonExistentOpening")
    void should_throwResourceNotFoundException_when_deletingNonExistentOpening() {
        // Arrange
        when(openingRepository.findByIdAndUserId(OPENING_ID, USER_ID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userOpeningService.deleteOpening(USER_ID, OPENING_ID))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Opening");
    }

    // ─── updateVisibility ────────────────────────────────────────────────

    @Test
    @DisplayName("should_updateVisibility_when_userIsOwner")
    void should_updateVisibility_when_userIsOwner() {
        // Arrange
        Opening opening = createSampleOpening(OPENING_ID, USER_ID);
        assertThat(opening.getIsPublic()).isFalse(); // starts as private

        Opening updated = createSampleOpening(OPENING_ID, USER_ID);
        updated.setIsPublic(true);

        var request = new UpdateVisibilityRequest(true);
        when(openingRepository.findByIdAndUserId(OPENING_ID, USER_ID)).thenReturn(Optional.of(opening));
        when(openingRepository.save(any(Opening.class))).thenReturn(updated);
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(createSampleUser(USER_ID)));

        // Act
        UserOpeningResponse result = userOpeningService.updateVisibility(USER_ID, OPENING_ID, request);

        // Assert
        assertThat(result.isPublic()).isTrue();

        verify(openingRepository).findByIdAndUserId(OPENING_ID, USER_ID);
        verify(openingRepository).save(any(Opening.class));
    }
}
