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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicOpeningServiceImpl implements PublicOpeningService {

    private final OpeningRepository openingRepository;

    @Override
    public PageResponse<OpeningListItemResponse> getPublicOpenings(Pageable pageable) {
        var page = openingRepository.findByIsPublicTrue(pageable);
        return PageResponse.from(page.map(this::toListItemResponse));
    }

    @Override
    public OpeningDetailResponse getPublicOpening(UUID id) {
        var opening = openingRepository.findByIdAndIsPublicTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Ouverture non trouvée"));
        return toDetailResponse(opening);
    }

    @Override
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(String query, String ecoCode, String moves, Pageable pageable) {
        var page = openingRepository.searchPublicOpenings(
                query != null && query.isBlank() ? null : query,
                ecoCode != null && ecoCode.isBlank() ? null : ecoCode,
                moves != null && moves.isBlank() ? null : moves,
                pageable);
        return PageResponse.from(page.map(this::toListItemResponse));
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

    private int countMoves(String moves) {
        if (moves == null || moves.isBlank()) return 0;
        return (int) java.util.Arrays.stream(moves.trim().split("\\s+"))
                .filter(token -> !token.matches("\\d+\\.+"))
                .count();
    }
}
