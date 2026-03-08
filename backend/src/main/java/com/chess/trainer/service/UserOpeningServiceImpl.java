package com.chess.trainer.service;

import com.chess.trainer.dto.request.CreateOpeningRequest;
import com.chess.trainer.dto.request.UpdateOpeningRequest;
import com.chess.trainer.dto.request.UpdateVisibilityRequest;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.dto.response.UserOpeningListItemResponse;
import com.chess.trainer.dto.response.UserOpeningResponse;
import com.chess.trainer.entity.Opening;
import com.chess.trainer.exception.ResourceNotFoundException;
import com.chess.trainer.repository.OpeningRepository;
import com.chess.trainer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserOpeningServiceImpl implements UserOpeningService {

    private final OpeningRepository openingRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<UserOpeningListItemResponse> getUserOpenings(
            UUID userId, String query, String ecoCode, String moves,
            String visibility, Pageable pageable) {
        String normalizedQuery = normalizeParam(query);
        String normalizedEcoCode = normalizeParam(ecoCode);
        String normalizedMoves = normalizeParam(moves);
        Boolean isPublic = resolveVisibility(visibility);

        Page<Opening> openings = openingRepository.searchUserOpenings(
                userId, normalizedQuery, normalizedEcoCode, normalizedMoves, isPublic, pageable);
        return toPageResponse(openings);
    }

    private String normalizeParam(String value) {
        return (value != null && !value.isBlank()) ? value : null;
    }

    private Boolean resolveVisibility(String visibility) {
        if (visibility == null) {
            return null;
        }
        return switch (visibility.toLowerCase()) {
            case "public" -> true;
            case "private" -> false;
            default -> null;
        };
    }

    @Override
    @Transactional
    public UserOpeningResponse createOpening(UUID userId, CreateOpeningRequest request) {
        Opening opening = Opening.builder()
                .name(request.name())
                .description(request.description())
                .ecoCode(request.ecoCode())
                .moves(request.moves())
                .isPublic(request.isPublic())
                .userId(userId)
                .build();
        Opening saved = openingRepository.save(opening);
        return toResponse(saved);
    }

    @Override
    public UserOpeningResponse getOpening(UUID userId, UUID openingId) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));
        return toResponse(opening);
    }

    @Override
    @Transactional
    public UserOpeningResponse updateOpening(UUID userId, UUID openingId, UpdateOpeningRequest request) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));
        opening.setName(request.name());
        opening.setDescription(request.description());
        opening.setEcoCode(request.ecoCode());
        opening.setMoves(request.moves());
        opening.setIsPublic(request.isPublic());
        Opening updated = openingRepository.save(opening);
        return toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteOpening(UUID userId, UUID openingId) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));
        openingRepository.delete(opening);
    }

    @Override
    @Transactional
    public UserOpeningResponse updateVisibility(UUID userId, UUID openingId, UpdateVisibilityRequest request) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));
        opening.setIsPublic(request.isPublic());
        Opening updated = openingRepository.save(opening);
        return toResponse(updated);
    }

    // --- Private mapping methods ---

    private PageResponse<UserOpeningListItemResponse> toPageResponse(Page<Opening> page) {
        List<UserOpeningListItemResponse> content = page.getContent().stream()
                .map(this::toListItemResponse)
                .toList();
        return new PageResponse<>(content, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    private UserOpeningResponse toResponse(Opening opening) {
        return new UserOpeningResponse(
                opening.getId(),
                opening.getName(),
                opening.getDescription(),
                opening.getEcoCode(),
                opening.getMoves(),
                countMoves(opening.getMoves()),
                opening.getIsPublic(),
                getAuthorName(opening.getUserId()),
                opening.getCreatedAt(),
                opening.getUpdatedAt()
        );
    }

    private UserOpeningListItemResponse toListItemResponse(Opening opening) {
        return new UserOpeningListItemResponse(
                opening.getId(),
                opening.getName(),
                opening.getDescription(),
                opening.getEcoCode(),
                countMoves(opening.getMoves()),
                opening.getIsPublic(),
                opening.getCreatedAt(),
                opening.getUpdatedAt()
        );
    }

    private String getAuthorName(UUID userId) {
        if (userId == null) {
            return "Système";
        }
        return userRepository.findById(userId)
                .map(user -> user.getFirstName() + " " + user.getLastName())
                .orElse("Unknown");
    }

    private int countMoves(String moves) {
        if (moves == null || moves.isBlank()) {
            return 0;
        }
        String cleaned = moves.replaceAll("\\d+\\.+\\s*", "");
        return (int) Arrays.stream(cleaned.split("\\s+"))
                .filter(s -> !s.isEmpty())
                .count();
    }
}
