package com.example.app.service;

import com.example.app.dto.OpeningDetailResponse;
import com.example.app.dto.OpeningListItemResponse;
import com.example.app.dto.PageResponse;
import com.example.app.entity.Opening;
import com.example.app.repository.OpeningRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicOpeningServiceImpl implements PublicOpeningService {

    private static final Pattern MOVE_NUMBER_PATTERN = Pattern.compile("\\d+\\.");

    private final OpeningRepository openingRepository;

    @Override
    public PageResponse<OpeningListItemResponse> getPublicOpenings(Pageable pageable) {
        var page = openingRepository.findByIsPublicTrue(pageable)
                .map(this::toListItemResponse);
        return PageResponse.from(page);
    }

    @Override
    public OpeningDetailResponse getPublicOpening(UUID id) {
        var opening = openingRepository.findByIdAndIsPublicTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Ouverture non trouvée"));
        return toDetailResponse(opening);
    }

    @Override
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(String query, Pageable pageable) {
        var page = openingRepository.searchPublicByName(query, pageable)
                .map(this::toListItemResponse);
        return PageResponse.from(page);
    }

    @Override
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            String query, String ecoCode, String moves, Pageable pageable) {
        var page = openingRepository.searchPublicOpenings(query, ecoCode, moves, pageable)
                .map(this::toListItemResponse);
        return PageResponse.from(page);
    }

    private OpeningListItemResponse toListItemResponse(Opening opening) {
        return new OpeningListItemResponse(
                opening.getId(),
                opening.getName(),
                opening.getDescription(),
                opening.getEcoCode(),
                countMoves(opening.getMoves()),
                getAuthorName(opening),
                opening.getCreatedAt()
        );
    }

    private OpeningDetailResponse toDetailResponse(Opening opening) {
        return new OpeningDetailResponse(
                opening.getId(),
                opening.getName(),
                opening.getDescription(),
                opening.getEcoCode(),
                opening.getMoves(),
                getAuthorName(opening),
                opening.getCreatedAt(),
                opening.getUpdatedAt()
        );
    }

    private String getAuthorName(Opening opening) {
        if (opening.getUser() == null) {
            return "Système";
        }
        return opening.getUser().getFirstName() + " " + opening.getUser().getLastName();
    }

    private Integer countMoves(String moves) {
        if (moves == null || moves.isBlank()) {
            return 0;
        }
        // Count move numbers (e.g., "1.e4 c5 2.Nf3 d6" has 2 moves)
        return (int) MOVE_NUMBER_PATTERN.matcher(moves).results().count();
    }
}
