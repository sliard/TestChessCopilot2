package com.chess.trainer.service;

import com.chess.trainer.dto.response.OpeningDetailResponse;
import com.chess.trainer.dto.response.OpeningListItemResponse;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.entity.Opening;
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
import org.springframework.data.domain.Sort;

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
class PublicOpeningServiceImplTest {

    @Mock
    private OpeningRepository openingRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PublicOpeningServiceImpl publicOpeningService;

    private Opening createTestOpening(UUID id, String name, String moves, boolean isPublic) {
        return Opening.builder()
                .id(id)
                .name(name)
                .description("Test description for " + name)
                .ecoCode("B20")
                .moves(moves)
                .isPublic(isPublic)
                .userId(null)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("should_returnPageOfOpenings_when_publicOpeningsExist")
    void should_returnPageOfOpenings_when_publicOpeningsExist() {
        // Arrange
        UUID id1 = UUID.randomUUID();
        UUID id2 = UUID.randomUUID();
        List<Opening> openings = List.of(
                createTestOpening(id1, "Sicilian Defense", "1. e4 c5", true),
                createTestOpening(id2, "Ruy Lopez", "1. e4 e5 2. Nf3 Nc6 3. Bb5", true)
        );
        Page<Opening> page = new PageImpl<>(openings);
        when(openingRepository.findByIsPublicTrue(any(Pageable.class))).thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(0, 20);

        // Assert
        assertThat(result.content()).hasSize(2);
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
        assertThat(result.content().get(0).movesCount()).isEqualTo(2);
        assertThat(result.content().get(0).author()).isEqualTo("Système");
        assertThat(result.content().get(1).name()).isEqualTo("Ruy Lopez");
        assertThat(result.content().get(1).movesCount()).isEqualTo(5);
    }

    @Test
    @DisplayName("should_returnOpeningDetail_when_openingIsPublic")
    void should_returnOpeningDetail_when_openingIsPublic() {
        // Arrange
        UUID id = UUID.randomUUID();
        Opening opening = createTestOpening(id, "Sicilian Defense", "1. e4 c5", true);
        when(openingRepository.findById(id)).thenReturn(Optional.of(opening));

        // Act
        OpeningDetailResponse result = publicOpeningService.getPublicOpening(id);

        // Assert
        assertThat(result.id()).isEqualTo(id);
        assertThat(result.name()).isEqualTo("Sicilian Defense");
        assertThat(result.moves()).isEqualTo("1. e4 c5");
        assertThat(result.author()).isEqualTo("Système");
    }

    @Test
    @DisplayName("should_throwNotFound_when_openingIsNotPublic")
    void should_throwNotFound_when_openingIsNotPublic() {
        // Arrange
        UUID id = UUID.randomUUID();
        Opening opening = createTestOpening(id, "Private Opening", "1. e4 e5", false);
        when(openingRepository.findById(id)).thenReturn(Optional.of(opening));

        // Act & Assert
        assertThatThrownBy(() -> publicOpeningService.getPublicOpening(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("should_throwNotFound_when_openingDoesNotExist")
    void should_throwNotFound_when_openingDoesNotExist() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(openingRepository.findById(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> publicOpeningService.getPublicOpening(id))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("should_searchOpenings_when_queryProvided")
    void should_searchOpenings_when_queryProvided() {
        // Arrange
        UUID id = UUID.randomUUID();
        List<Opening> openings = List.of(createTestOpening(id, "Sicilian Defense", "1. e4 c5", true));
        Page<Opening> page = new PageImpl<>(openings);
        when(openingRepository.searchPublicOpenings(eq("sicilian"), eq(null), eq(null), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.searchPublicOpenings(
                "sicilian", null, null, "createdAt", "desc", 0, 20);

        // Assert
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
    }

    @Test
    @DisplayName("should_returnUserName_when_openingHasUserId")
    void should_returnUserName_when_openingHasUserId() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID openingId = UUID.randomUUID();
        Opening opening = createTestOpening(openingId, "Custom Opening", "1. d4 d5", true);
        opening.setUserId(userId);

        User user = User.builder()
                .id(userId)
                .firstName("John")
                .lastName("Doe")
                .build();

        when(openingRepository.findById(openingId)).thenReturn(Optional.of(opening));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        OpeningDetailResponse result = publicOpeningService.getPublicOpening(openingId);

        // Assert
        assertThat(result.author()).isEqualTo("John Doe");
    }

    @Test
    @DisplayName("should_countMoves_correctly")
    void should_countMoves_correctly() {
        // Arrange
        UUID id = UUID.randomUUID();
        Opening opening = createTestOpening(id, "Test", "1. e4 e5 2. Nf3 Nc6 3. Bb5", true);
        when(openingRepository.findByIsPublicTrue(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(opening)));

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(0, 20);

        // Assert
        assertThat(result.content().get(0).movesCount()).isEqualTo(5);
    }

    // ─── searchPublicOpenings ────────────────────────────────────────────

    @Test
    @DisplayName("should_returnAllPublicOpenings_when_noFiltersProvided")
    void should_returnAllPublicOpenings_when_noFiltersProvided() {
        // Arrange
        Opening opening = createTestOpening(UUID.randomUUID(), "Sicilian Defense", "1. e4 c5", true);
        Page<Opening> page = new PageImpl<>(List.of(opening));
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings(null, null, null, "createdAt", "desc", 0, 20);

        // Assert
        assertThat(result.content()).hasSize(1);
        verify(openingRepository).searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_filterByName_when_queryProvided")
    void should_filterByName_when_queryProvided() {
        // Arrange
        Opening opening = createTestOpening(UUID.randomUUID(), "Sicilian Defense", "1. e4 c5", true);
        Page<Opening> page = new PageImpl<>(List.of(opening));
        when(openingRepository.searchPublicOpenings(eq("sicil"), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings("sicil", null, null, "createdAt", "desc", 0, 20);

        // Assert
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
        verify(openingRepository).searchPublicOpenings(eq("sicil"), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_filterByEcoCode_when_ecoCodeProvided")
    void should_filterByEcoCode_when_ecoCodeProvided() {
        // Arrange
        Opening opening = createTestOpening(UUID.randomUUID(), "Sicilian Defense", "1. e4 c5", true);
        Page<Opening> page = new PageImpl<>(List.of(opening));
        when(openingRepository.searchPublicOpenings(isNull(), eq("B20"), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings(null, "B20", null, "createdAt", "desc", 0, 20);

        // Assert
        assertThat(result.content()).hasSize(1);
        verify(openingRepository).searchPublicOpenings(isNull(), eq("B20"), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_filterByMoves_when_movesProvided")
    void should_filterByMoves_when_movesProvided() {
        // Arrange
        Opening opening = createTestOpening(UUID.randomUUID(), "Sicilian Defense", "1. e4 c5", true);
        Page<Opening> page = new PageImpl<>(List.of(opening));
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), eq("1. e4 c5"), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings(null, null, "1. e4 c5", "createdAt", "desc", 0, 20);

        // Assert
        assertThat(result.content()).hasSize(1);
        verify(openingRepository).searchPublicOpenings(isNull(), isNull(), eq("1. e4 c5"), any(Pageable.class));
    }

    @Test
    @DisplayName("should_combineFilters_when_multipleFiltersProvided")
    void should_combineFilters_when_multipleFiltersProvided() {
        // Arrange
        Opening opening = createTestOpening(UUID.randomUUID(), "Sicilian Defense", "1. e4 c5", true);
        Page<Opening> page = new PageImpl<>(List.of(opening));
        when(openingRepository.searchPublicOpenings(eq("sicil"), eq("B20"), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings("sicil", "B20", null, "createdAt", "desc", 0, 20);

        // Assert
        assertThat(result.content()).hasSize(1);
        verify(openingRepository).searchPublicOpenings(eq("sicil"), eq("B20"), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_sortByName_when_sortByNameProvided")
    void should_sortByName_when_sortByNameProvided() {
        // Arrange
        Page<Opening> emptyPage = new PageImpl<>(List.of());
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        publicOpeningService.searchPublicOpenings(null, null, null, "name", "asc", 0, 20);

        // Assert
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(openingRepository).searchPublicOpenings(isNull(), isNull(), isNull(), pageableCaptor.capture());

        Pageable captured = pageableCaptor.getValue();
        Sort.Order sortOrder = captured.getSort().getOrderFor("name");
        assertThat(sortOrder).isNotNull();
        assertThat(sortOrder.getDirection()).isEqualTo(Sort.Direction.ASC);
    }

    @Test
    @DisplayName("should_sortDescByDefault_when_noOrderProvided")
    void should_sortDescByDefault_when_noOrderProvided() {
        // Arrange
        Page<Opening> emptyPage = new PageImpl<>(List.of());
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        publicOpeningService.searchPublicOpenings(null, null, null, "createdAt", null, 0, 20);

        // Assert
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(openingRepository).searchPublicOpenings(isNull(), isNull(), isNull(), pageableCaptor.capture());

        Pageable captured = pageableCaptor.getValue();
        Sort.Order sortOrder = captured.getSort().getOrderFor("createdAt");
        assertThat(sortOrder).isNotNull();
        assertThat(sortOrder.getDirection()).isEqualTo(Sort.Direction.DESC);
    }

    @Test
    @DisplayName("should_fallbackToCreatedAt_when_invalidSortFieldProvided")
    void should_fallbackToCreatedAt_when_invalidSortFieldProvided() {
        // Arrange
        Page<Opening> emptyPage = new PageImpl<>(List.of());
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        publicOpeningService.searchPublicOpenings(null, null, null, "invalidField", "asc", 0, 20);

        // Assert
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(openingRepository).searchPublicOpenings(isNull(), isNull(), isNull(), pageableCaptor.capture());

        Pageable captured = pageableCaptor.getValue();
        Sort.Order sortOrder = captured.getSort().getOrderFor("createdAt");
        assertThat(sortOrder).isNotNull();
    }

    @Test
    @DisplayName("should_normalizeEmptyStringsToNull")
    void should_normalizeEmptyStringsToNull() {
        // Arrange
        Page<Opening> emptyPage = new PageImpl<>(List.of());
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(emptyPage);

        // Act
        publicOpeningService.searchPublicOpenings("", "  ", "   ", "createdAt", "desc", 0, 20);

        // Assert — blank/empty strings must be normalized to null
        verify(openingRepository).searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    @DisplayName("should_returnCorrectPageResponse_when_searchReturnsResults")
    void should_returnCorrectPageResponse_when_searchReturnsResults() {
        // Arrange
        Opening opening1 = createTestOpening(UUID.randomUUID(), "Sicilian Defense", "1. e4 c5", true);
        Opening opening2 = createTestOpening(UUID.randomUUID(), "Ruy Lopez", "1. e4 e5 2. Nf3 Nc6 3. Bb5", true);
        PageRequest pageRequest = PageRequest.of(1, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Opening> page = new PageImpl<>(List.of(opening1, opening2), pageRequest, 25);
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings(null, null, null, "createdAt", "desc", 1, 10);

        // Assert
        assertThat(result.content()).hasSize(2);
        assertThat(result.page()).isEqualTo(1);
        assertThat(result.size()).isEqualTo(10);
        assertThat(result.totalElements()).isEqualTo(25);
        assertThat(result.totalPages()).isEqualTo(3);
    }

    @Test
    @DisplayName("should_countMovesCorrectly_when_searchReturnsResults")
    void should_countMovesCorrectly_when_searchReturnsResults() {
        // Arrange
        Opening noMoves = createTestOpening(UUID.randomUUID(), "Empty", "", true);
        Opening singleMove = createTestOpening(UUID.randomUUID(), "Single", "1. e4", true);
        Opening multiMoves = createTestOpening(UUID.randomUUID(), "Multi", "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6", true);
        Page<Opening> page = new PageImpl<>(List.of(noMoves, singleMove, multiMoves));
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings(null, null, null, "createdAt", "desc", 0, 20);

        // Assert
        assertThat(result.content().get(0).movesCount()).isZero();
        assertThat(result.content().get(1).movesCount()).isEqualTo(1);
        assertThat(result.content().get(2).movesCount()).isEqualTo(6);
    }
}
