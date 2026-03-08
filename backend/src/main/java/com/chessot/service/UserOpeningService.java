package com.chessot.service;

import com.chessot.dto.request.OpeningRequest;
import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;

import java.util.UUID;

public interface UserOpeningService {

    PageResponse<OpeningListItemResponse> getUserOpenings(UUID userId, int page, int size);

    OpeningDetailResponse getUserOpening(UUID openingId, UUID userId);

    OpeningDetailResponse createOpening(OpeningRequest request, UUID userId);

    OpeningDetailResponse updateOpening(UUID openingId, OpeningRequest request, UUID userId);

    void deleteOpening(UUID openingId, UUID userId);

    OpeningDetailResponse toggleVisibility(UUID openingId, UUID userId);

    PageResponse<OpeningListItemResponse> searchUserOpenings(
            UUID userId, String query, String ecoCode, String moves,
            String visibility, int page, int size, String sort, String order);
}
