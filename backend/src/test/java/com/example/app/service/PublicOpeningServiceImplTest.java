package com.example.app.service;

import com.example.app.dto.OpeningDetailResponse;
import com.example.app.dto.OpeningListItemResponse;
import com.example.app.dto.PageResponse;
import com.example.app.entity.Opening;
import com.example.app.entity.Role;
import com.example.app.entity.User;
import com.example.app.repository.OpeningRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
class PublicOpeningServiceImplTest {

    @Mock
    private OpeningRepository openingRepository;

    @InjectMocks
    private PublicOpeningServiceImpl publicOpeningService;

    private Opening testOpening;
    private User testUser;
    private Pageable pageable;

    @BeforeEach
    void setUp() {
        pageable = PageRequest.of(0, 20);

        testUser = User.builder()
                .id(UUID.randomUUID())
                .email("john@example.com")
                .password("encoded-password")
                .firstName("John")
                .lastName("Doe")
                .role(Role.USER)
                .enabled(true)
                .build();

        testOpening = Opening.builder()
                .id(UUID.randomUUID())
                .name("Sicilian Defense")
                .description("A sharp opening")
                .ecoCode("B20")
                .moves("1.e4 c5 2.Nf3 d6 3.d4 cxd4")
                .isPublic(true)
                .user(testUser)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    // ========== getPublicOpenings ==========

    @Test
    void should_returnPageOfOpenings_when_publicOpeningsExist() {
        // Arrange
        Page<Opening> openingPage = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.findByIsPublicTrue(pageable)).thenReturn(openingPage);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).id()).isEqualTo(testOpening.getId());
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
        assertThat(result.content().get(0).ecoCode()).isEqualTo("B20");
        assertThat(result.totalElements()).isEqualTo(1);
        assertThat(result.page()).isZero();
        assertThat(result.first()).isTrue();
        assertThat(result.last()).isTrue();
        verify(openingRepository).findByIsPublicTrue(pageable);
    }

    @Test
    void should_returnEmptyPage_when_noPublicOpenings() {
        // Arrange
        Page<Opening> emptyPage = new PageImpl<>(List.of(), pageable, 0);
        when(openingRepository.findByIsPublicTrue(pageable)).thenReturn(emptyPage);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).isEmpty();
        assertThat(result.totalElements()).isZero();
        verify(openingRepository).findByIsPublicTrue(pageable);
    }

    // ========== getPublicOpening ==========

    @Test
    void should_returnOpeningDetail_when_validPublicId() {
        // Arrange
        UUID id = testOpening.getId();
        when(openingRepository.findByIdAndIsPublicTrue(id)).thenReturn(Optional.of(testOpening));

        // Act
        OpeningDetailResponse result = publicOpeningService.getPublicOpening(id);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(id);
        assertThat(result.name()).isEqualTo("Sicilian Defense");
        assertThat(result.description()).isEqualTo("A sharp opening");
        assertThat(result.ecoCode()).isEqualTo("B20");
        assertThat(result.moves()).isEqualTo("1.e4 c5 2.Nf3 d6 3.d4 cxd4");
        assertThat(result.author()).isEqualTo("John Doe");
        assertThat(result.createdAt()).isNotNull();
        assertThat(result.updatedAt()).isNotNull();
        verify(openingRepository).findByIdAndIsPublicTrue(id);
    }

    @Test
    void should_throwEntityNotFound_when_openingNotFound() {
        // Arrange
        UUID id = UUID.randomUUID();
        when(openingRepository.findByIdAndIsPublicTrue(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> publicOpeningService.getPublicOpening(id))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Ouverture non trouvée");
        verify(openingRepository).findByIdAndIsPublicTrue(id);
    }

    @Test
    void should_throwEntityNotFound_when_openingNotPublic() {
        // Arrange — even with a valid UUID, findByIdAndIsPublicTrue returns empty for non-public
        UUID id = UUID.randomUUID();
        when(openingRepository.findByIdAndIsPublicTrue(id)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> publicOpeningService.getPublicOpening(id))
                .isInstanceOf(EntityNotFoundException.class);
        verify(openingRepository).findByIdAndIsPublicTrue(id);
    }

    // ========== searchPublicOpenings ==========

    @Test
    void should_returnSearchResults_when_queryMatches() {
        // Arrange
        String query = "Sicilian";
        Page<Opening> searchPage = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.searchPublicByName(eq(query), eq(pageable))).thenReturn(searchPage);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.searchPublicOpenings(query, pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
        assertThat(result.totalElements()).isEqualTo(1);
        verify(openingRepository).searchPublicByName(query, pageable);
    }

    @Test
    void should_returnEmptySearchResults_when_noMatch() {
        // Arrange
        String query = "NonExistentOpening";
        Page<Opening> emptyPage = new PageImpl<>(List.of(), pageable, 0);
        when(openingRepository.searchPublicByName(eq(query), eq(pageable))).thenReturn(emptyPage);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.searchPublicOpenings(query, pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).isEmpty();
        assertThat(result.totalElements()).isZero();
        verify(openingRepository).searchPublicByName(query, pageable);
    }

    // ========== Author mapping ==========

    @Test
    void should_returnSystemAuthor_when_userIsNull() {
        // Arrange
        Opening systemOpening = Opening.builder()
                .id(UUID.randomUUID())
                .name("Italian Game")
                .description("Classic opening")
                .ecoCode("C50")
                .moves("1.e4 e5 2.Nf3 Nc6 3.Bc4")
                .isPublic(true)
                .user(null)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        Page<Opening> page = new PageImpl<>(List.of(systemOpening), pageable, 1);
        when(openingRepository.findByIsPublicTrue(pageable)).thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(pageable);

        // Assert
        assertThat(result.content().get(0).author()).isEqualTo("Système");
    }

    @Test
    void should_returnUserName_when_userExists() {
        // Arrange
        Page<Opening> page = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.findByIsPublicTrue(pageable)).thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(pageable);

        // Assert
        assertThat(result.content().get(0).author()).isEqualTo("John Doe");
    }

    // ========== Move counting ==========

    @Test
    void should_countMoves_when_validMovesString() {
        // Arrange — testOpening has "1.e4 c5 2.Nf3 d6 3.d4 cxd4" → 3 moves
        Page<Opening> page = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.findByIsPublicTrue(pageable)).thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(pageable);

        // Assert
        assertThat(result.content().get(0).movesCount()).isEqualTo(3);
    }

    @Test
    void should_returnZeroMoves_when_movesIsNull() {
        // Arrange
        Opening nullMovesOpening = Opening.builder()
                .id(UUID.randomUUID())
                .name("Unknown Opening")
                .description("No moves")
                .ecoCode("A00")
                .moves(null)
                .isPublic(true)
                .user(null)
                .createdAt(Instant.now())
                .build();
        Page<Opening> page = new PageImpl<>(List.of(nullMovesOpening), pageable, 1);
        when(openingRepository.findByIsPublicTrue(pageable)).thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(pageable);

        // Assert
        assertThat(result.content().get(0).movesCount()).isZero();
    }

    @Test
    void should_returnZeroMoves_when_movesIsBlank() {
        // Arrange
        Opening blankMovesOpening = Opening.builder()
                .id(UUID.randomUUID())
                .name("Empty Opening")
                .description("Blank moves")
                .ecoCode("A00")
                .moves("   ")
                .isPublic(true)
                .user(null)
                .createdAt(Instant.now())
                .build();
        Page<Opening> page = new PageImpl<>(List.of(blankMovesOpening), pageable, 1);
        when(openingRepository.findByIsPublicTrue(pageable)).thenReturn(page);

        // Act
        PageResponse<OpeningListItemResponse> result = publicOpeningService.getPublicOpenings(pageable);

        // Assert
        assertThat(result.content().get(0).movesCount()).isZero();
    }

    // ========== searchPublicOpenings (with ecoCode/moves filters) ==========

    @Test
    void should_returnFilteredResults_when_searchWithEcoCode() {
        // Arrange
        Page<Opening> searchPage = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.searchPublicOpenings(isNull(), eq("B20"), isNull(), eq(pageable)))
                .thenReturn(searchPage);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings(null, "B20", null, pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).ecoCode()).isEqualTo("B20");
        assertThat(result.totalElements()).isEqualTo(1);
        verify(openingRepository).searchPublicOpenings(isNull(), eq("B20"), isNull(), eq(pageable));
    }

    @Test
    void should_returnFilteredResults_when_searchWithMoves() {
        // Arrange
        Page<Opening> searchPage = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.searchPublicOpenings(isNull(), isNull(), eq("1.e4 c5"), eq(pageable)))
                .thenReturn(searchPage);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings(null, null, "1.e4 c5", pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
        assertThat(result.totalElements()).isEqualTo(1);
        verify(openingRepository).searchPublicOpenings(isNull(), isNull(), eq("1.e4 c5"), eq(pageable));
    }

    @Test
    void should_returnFilteredResults_when_searchWithCombinedFilters() {
        // Arrange
        Page<Opening> searchPage = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.searchPublicOpenings(eq("Sicilian"), eq("B20"), eq("1.e4 c5"), eq(pageable)))
                .thenReturn(searchPage);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings("Sicilian", "B20", "1.e4 c5", pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
        assertThat(result.content().get(0).ecoCode()).isEqualTo("B20");
        assertThat(result.totalElements()).isEqualTo(1);
        verify(openingRepository).searchPublicOpenings(eq("Sicilian"), eq("B20"), eq("1.e4 c5"), eq(pageable));
    }

    @Test
    void should_returnFilteredResults_when_searchWithQueryAndEcoCode() {
        // Arrange
        Page<Opening> searchPage = new PageImpl<>(List.of(testOpening), pageable, 1);
        when(openingRepository.searchPublicOpenings(eq("Sicilian"), eq("B20"), isNull(), eq(pageable)))
                .thenReturn(searchPage);

        // Act
        PageResponse<OpeningListItemResponse> result =
                publicOpeningService.searchPublicOpenings("Sicilian", "B20", null, pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.content()).hasSize(1);
        assertThat(result.content().get(0).name()).isEqualTo("Sicilian Defense");
        assertThat(result.content().get(0).ecoCode()).isEqualTo("B20");
        assertThat(result.totalElements()).isEqualTo(1);
        verify(openingRepository).searchPublicOpenings(eq("Sicilian"), eq("B20"), isNull(), eq(pageable));
    }
}
