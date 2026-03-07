package com.example.app.service;

import com.example.app.dto.OpeningDetailResponse;
import com.example.app.dto.OpeningListItemResponse;
import com.example.app.dto.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PublicOpeningService {

    PageResponse<OpeningListItemResponse> getPublicOpenings(Pageable pageable);

    OpeningDetailResponse getPublicOpening(UUID id);

    PageResponse<OpeningListItemResponse> searchPublicOpenings(String query, Pageable pageable);
}
