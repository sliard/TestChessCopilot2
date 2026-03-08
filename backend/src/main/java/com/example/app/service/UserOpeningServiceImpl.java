package com.example.app.service;

import com.example.app.dto.*;
import com.example.app.entity.Opening;
import com.example.app.entity.User;
import com.example.app.repository.OpeningRepository;
import com.example.app.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
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
    public PageResponse<UserOpeningListItemResponse> getUserOpenings(UUID userId, String query, Pageable pageable) {
        var page = (query != null && !query.isBlank())
                ? openingRepository.searchByUserIdAndName(userId, query, pageable)
                : openingRepository.findByUserId(userId, pageable);
        return PageResponse.from(page.map(this::toListItemResponse));
    }

    @Override
    @Transactional
    public UserOpeningResponse createOpening(UUID userId, CreateOpeningRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        Opening opening = Opening.builder()
                .name(request.name())
                .description(request.description())
                .ecoCode(request.ecoCode())
                .moves(request.moves())
                .isPublic(request.isPublic())
                .user(user)
                .build();

        Opening saved = openingRepository.save(opening);
        return toResponse(saved);
    }

    @Override
    public UserOpeningResponse getOpening(UUID userId, UUID openingId) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Ouverture non trouvée"));
        return toResponse(opening);
    }

    @Override
    @Transactional
    public UserOpeningResponse updateOpening(UUID userId, UUID openingId, UpdateOpeningRequest request) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Ouverture non trouvée"));

        opening.setName(request.name());
        opening.setDescription(request.description());
        opening.setEcoCode(request.ecoCode());
        opening.setMoves(request.moves());
        opening.setIsPublic(request.isPublic());

        Opening saved = openingRepository.save(opening);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteOpening(UUID userId, UUID openingId) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Ouverture non trouvée"));
        openingRepository.delete(opening);
    }

    @Override
    @Transactional
    public UserOpeningResponse updateVisibility(UUID userId, UUID openingId, UpdateVisibilityRequest request) {
        Opening opening = openingRepository.findByIdAndUserId(openingId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Ouverture non trouvée"));
        opening.setIsPublic(request.isPublic());
        Opening saved = openingRepository.save(opening);
        return toResponse(saved);
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
                getAuthorName(opening),
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

    private String getAuthorName(Opening opening) {
        if (opening.getUser() == null) return "Système";
        return opening.getUser().getFirstName() + " " + opening.getUser().getLastName();
    }

    private int countMoves(String moves) {
        if (moves == null || moves.isBlank()) return 0;
        return (int) java.util.Arrays.stream(moves.trim().split("\\s+"))
                .filter(token -> !token.matches("\\d+\\.+"))
                .count();
    }
}
