package com.chessot.service;

import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;
import com.chessot.entity.Opening;
import com.chessot.entity.User;
import org.springframework.data.domain.Page;

import java.util.Arrays;

/**
 * Shared mapping utilities for converting Opening entities to DTOs.
 */
public final class OpeningMapper {

    private OpeningMapper() {
        // utility class
    }

    public static OpeningDetailResponse toDetailResponse(Opening opening) {
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

    public static OpeningListItemResponse toListItemResponse(Opening opening) {
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

    public static PageResponse<OpeningListItemResponse> toPageResponse(Page<Opening> page) {
        return new PageResponse<>(
                page.getContent().stream()
                        .map(OpeningMapper::toListItemResponse)
                        .toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    public static int countMoves(String moves) {
        if (moves == null || moves.isBlank()) {
            return 0;
        }
        return (int) Arrays.stream(moves.trim().split("\\s+"))
                .filter(token -> !token.matches("\\d+\\.+"))
                .count();
    }

    public static String resolveAuthor(User user) {
        if (user == null) {
            return "Système";
        }
        String first = user.getFirstName() != null ? user.getFirstName() : "";
        String last = user.getLastName() != null ? user.getLastName() : "";
        String full = (first + " " + last).trim();
        return full.isEmpty() ? user.getEmail() : full;
    }
}
