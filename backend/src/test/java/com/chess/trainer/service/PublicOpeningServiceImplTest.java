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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
        when(openingRepository.findByIsPublicTrueAndNameContainingIgnoreCase(eq("sicilian"), any(Pageable.class)))
                .thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.searchPublicOpenings("sicilian", 0, 20);

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
}
