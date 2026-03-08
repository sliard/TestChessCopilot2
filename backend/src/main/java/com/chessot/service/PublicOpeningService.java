package com.chessot.service;

import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;

import java.util.UUID;

public interface PublicOpeningService {

    PageResponse<OpeningListItemResponse> getPublicOpenings(
            int page, int size, String sort, String order);

    OpeningDetailResponse getPublicOpening(UUID id);

    PageResponse<OpeningListItemResponse> searchPublicOpenings(
            String query, String ecoCode, String moves,
            int page, int size, String sort, String order);
}
