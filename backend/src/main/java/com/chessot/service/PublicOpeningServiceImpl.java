package com.chessot.service;

import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;
import com.chessot.entity.Opening;
import com.chessot.exception.ResourceNotFoundException;
import com.chessot.repository.OpeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        return OpeningMapper.toPageResponse(openingsPage);
    }

    @Override
    public OpeningDetailResponse getPublicOpening(UUID id) {
        Opening opening = openingRepository.findByIdAndIsPublicTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", id));

        return OpeningMapper.toDetailResponse(opening);
    }

    @Override
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            String query, String ecoCode, String moves,
            int page, int size, String sort, String order) {

        Pageable pageable = buildPageable(page, size, sort, order);
        Page<Opening> openingsPage = openingRepository.searchPublicOpenings(
                query, ecoCode, moves, pageable);

        return OpeningMapper.toPageResponse(openingsPage);
    }

    private Pageable buildPageable(int page, int size, String sort, String order) {
        String sortField = resolveSortField(sort);
        Sort.Direction direction = "asc".equalsIgnoreCase(order)
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return PageRequest.of(page, size, Sort.by(direction, sortField));
    }

    private String resolveSortField(String sort) {
        if (sort == null) {
            return "createdAt";
        }
        return switch (sort) {
            case "name" -> "name";
            case "ecoCode" -> "ecoCode";
            default -> "createdAt";
        };
    }
}
