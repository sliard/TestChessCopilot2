package com.chessot.service;

import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;
import com.chessot.entity.Opening;
import com.chessot.entity.User;
import com.chessot.exception.ResourceNotFoundException;
import com.chessot.repository.OpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PublicOpeningServiceImpl implements PublicOpeningService {

    private final OpeningRepository openingRepository;

    @Override
    public PageResponse<OpeningListItemResponse> getPublicOpenings(
            int page, int size, String sort, String order) {

        Pageable pageable = buildPageable(page, size, sort, order);
        Page<Opening> openingsPage = openingRepository.findByIsPublicTrue(pageable);

        return toOpeningPageResponse(openingsPage);
    }

    @Override
    public OpeningDetailResponse getPublicOpening(UUID id) {
        Opening opening = openingRepository.findByIdAndIsPublicTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", id));

        return toDetailResponse(opening);
    }

    @Override
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            String query, String ecoCode, String moves,
            int page, int size, String sort, String order) {

        Pageable pageable = buildPageable(page, size, sort, order);
        Page<Opening> openingsPage = openingRepository.searchPublicOpenings(
                query, ecoCode, moves, pageable);

        return toOpeningPageResponse(openingsPage);
    }

    private Pageable buildPageable(int page, int size, String sort, String order) {
        String sortField = resolveSortField(sort);
        Sort.Direction direction = "asc".equalsIgnoreCase(order)
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }

    private String resolveSortField(String sort) {
        return switch (sort) {
            case "name" -> "name";
            case "ecoCode" -> "ecoCode";
            default -> "createdAt";
        };
    }

    static int countMoves(String moves) {
        if (moves == null || moves.isBlank()) {
            return 0;
        }
        return (int) Arrays.stream(moves.trim().split("\\s+"))
                .filter(token -> !token.matches("\\d+\\.+"))
                .count();
    }

    static String resolveAuthor(User user) {
        if (user == null) {
            return "Système";
        }
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        String last = user.getLastName() != null ? user.getLastName() : "";
        String full = (first + " " + last).trim();
        return full.isEmpty() ? user.getEmail() : full;
    }

    static OpeningDetailResponse toDetailResponse(Opening opening) {
        return new OpeningDetailResponse(
                opening.getId(),
                opening.getName(),
                opening.getDescription(),
                opening.getEcoCode(),
                opening.getMoves(),
                opening.getIsPublic(),
                resolveAuthor(opening.getUser()),
                opening.getCreatedAt(),
                opening.getUpdatedAt()
        );
    }

    static OpeningListItemResponse toListItemResponse(Opening opening) {
        return new OpeningListItemResponse(
                opening.getId(),
                opening.getName(),
                opening.getDescription(),
                opening.getEcoCode(),
                countMoves(opening.getMoves()),
                resolveAuthor(opening.getUser()),
                opening.getCreatedAt()
        );
    }

    private PageResponse<OpeningListItemResponse> toOpeningPageResponse(Page<Opening> page) {
        return new PageResponse<>(
                page.getContent().stream()
                        .map(PublicOpeningServiceImpl::toListItemResponse)
                        .toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
