package com.chess.trainer.service;

import com.chess.trainer.dto.request.CreateOpeningRequest;
import com.chess.trainer.dto.request.UpdateOpeningRequest;
import com.chess.trainer.dto.request.UpdateVisibilityRequest;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.dto.response.UserOpeningListItemResponse;
import com.chess.trainer.dto.response.UserOpeningResponse;
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
