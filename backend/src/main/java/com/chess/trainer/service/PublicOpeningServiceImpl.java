package com.chess.trainer.service;

import com.chess.trainer.dto.response.OpeningDetailResponse;
import com.chess.trainer.dto.response.OpeningListItemResponse;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.entity.Opening;
import com.chess.trainer.exception.ResourceNotFoundException;
import com.chess.trainer.repository.OpeningRepository;
import com.chess.trainer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicOpeningServiceImpl implements PublicOpeningService {

    private final OpeningRepository openingRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<OpeningListItemResponse> getPublicOpenings(int page, int size) {
        Page<Opening> openings = openingRepository.findByIsPublicTrue(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return toPageResponse(openings);
    }

    @Override
    public OpeningDetailResponse getPublicOpening(UUID id) {
        Opening opening = openingRepository.findById(id)
                .filter(o -> Boolean.TRUE.equals(o.getIsPublic()))
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", id));
        return toDetailResponse(opening);
    }

    @Override
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(String query, int page, int size) {
        Page<Opening> openings = openingRepository.findByIsPublicTrueAndNameContainingIgnoreCase(
                query, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return toPageResponse(openings);
    }

    private PageResponse<OpeningListItemResponse> toPageResponse(Page<Opening> page) {
        List<OpeningListItemResponse> content = page.getContent().stream()
                .map(this::toListItemResponse)
                .toList();
        return new PageResponse<>(content, page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }

    private OpeningListItemResponse toListItemResponse(Opening opening) {
        return new OpeningListItemResponse(
                opening.getId(),
                opening.getName(),
                opening.getDescription(),
                opening.getEcoCode(),
                countMoves(opening.getMoves()),
                getAuthorName(opening.getUserId()),
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
                getAuthorName(opening.getUserId()),
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
