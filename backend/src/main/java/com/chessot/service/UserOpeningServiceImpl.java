package com.chessot.service;

import com.chessot.dto.request.OpeningRequest;
import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;
import com.chessot.entity.Opening;
import com.chessot.entity.User;
import com.chessot.exception.ResourceNotFoundException;
import com.chessot.repository.OpeningRepository;
import com.chessot.repository.UserRepository;
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
public class UserOpeningServiceImpl implements UserOpeningService {

    private final OpeningRepository openingRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<OpeningListItemResponse> getUserOpenings(
            UUID userId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Opening> openingsPage = openingRepository.findByUserId(userId, pageable);

        return toPageResponse(openingsPage);
    }

    @Override
    public OpeningDetailResponse getUserOpening(UUID openingId, UUID userId) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));

        return PublicOpeningServiceImpl.toDetailResponse(opening);
    }

    @Override
    @Transactional
    public OpeningDetailResponse createOpening(OpeningRequest request, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Opening opening = Opening.builder()
                .name(request.name())
                .description(request.description())
                .ecoCode(request.ecoCode())
                .moves(request.moves())
                .isPublic(request.isPublicOrDefault())
                .user(user)
                .build();

        Opening saved = openingRepository.save(opening);

        return PublicOpeningServiceImpl.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public OpeningDetailResponse updateOpening(
            UUID openingId, OpeningRequest request, UUID userId) {

        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));

        opening.setName(request.name());
        opening.setDescription(request.description());
        opening.setEcoCode(request.ecoCode());
        opening.setMoves(request.moves());
        opening.setIsPublic(request.isPublicOrDefault());

        Opening saved = openingRepository.save(opening);

        return PublicOpeningServiceImpl.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public void deleteOpening(UUID openingId, UUID userId) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));

        openingRepository.delete(opening);
    }

    @Override
    @Transactional
    public OpeningDetailResponse toggleVisibility(UUID openingId, UUID userId) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Opening", "id", openingId));

        opening.setIsPublic(!opening.getIsPublic());
        Opening saved = openingRepository.save(opening);

        return PublicOpeningServiceImpl.toDetailResponse(saved);
    }

    @Override
    public PageResponse<OpeningListItemResponse> searchUserOpenings(
            UUID userId, String query, String ecoCode, String moves,
            String visibility, int page, int size, String sort, String order) {

        Boolean isPublic = resolveVisibility(visibility);

        String sortField = resolveSortField(sort);
        Sort.Direction direction = "asc".equalsIgnoreCase(order)
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));

        Page<Opening> openingsPage = openingRepository.searchUserOpenings(
                userId, query, ecoCode, moves, isPublic, pageable);

        return toPageResponse(openingsPage);
    }

    private Boolean resolveVisibility(String visibility) {
        if (visibility == null || "all".equalsIgnoreCase(visibility)) {
            return null;
        }
        return "public".equalsIgnoreCase(visibility);
    }

    private String resolveSortField(String sort) {
        return switch (sort != null ? sort : "createdAt") {
            case "name" -> "name";
            case "ecoCode" -> "ecoCode";
            default -> "createdAt";
        };
    }

    private PageResponse<OpeningListItemResponse> toPageResponse(Page<Opening> page) {
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
