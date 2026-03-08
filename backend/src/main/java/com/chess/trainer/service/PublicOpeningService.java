package com.chess.trainer.service;

import com.chess.trainer.dto.response.OpeningDetailResponse;
import com.chess.trainer.dto.response.OpeningListItemResponse;
import com.chess.trainer.dto.response.PageResponse;

import java.util.UUID;

public interface PublicOpeningService {

    PageResponse<OpeningListItemResponse> getPublicOpenings(int page, int size);

    OpeningDetailResponse getPublicOpening(UUID id);

    PageResponse<OpeningListItemResponse> searchPublicOpenings(
            String query, String ecoCode, String moves,
            String sortBy, String order, int page, int size);
}
