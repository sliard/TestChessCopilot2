package com.example.app.service;

import com.example.app.dto.*;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserOpeningService {
    PageResponse<UserOpeningListItemResponse> getUserOpenings(UUID userId, String query, Pageable pageable);
    UserOpeningResponse createOpening(UUID userId, CreateOpeningRequest request);
    UserOpeningResponse getOpening(UUID userId, UUID openingId);
    UserOpeningResponse updateOpening(UUID userId, UUID openingId, UpdateOpeningRequest request);
    void deleteOpening(UUID userId, UUID openingId);
    UserOpeningResponse updateVisibility(UUID userId, UUID openingId, UpdateVisibilityRequest request);
}
