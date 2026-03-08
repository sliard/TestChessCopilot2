package com.chess.trainer.controller;

import com.chess.trainer.dto.response.OpeningDetailResponse;
import com.chess.trainer.dto.response.OpeningListItemResponse;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.service.PublicOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/openings")
@RequiredArgsConstructor
@Tag(name = "Public Openings", description = "Public read-only access to chess openings")
public class PublicOpeningController {

    private final PublicOpeningService publicOpeningService;

    @GetMapping
    @Operation(summary = "List public openings with pagination")
    public PageResponse<OpeningListItemResponse> getPublicOpenings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return publicOpeningService.getPublicOpenings(page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get public opening details")
    public OpeningDetailResponse getPublicOpening(@PathVariable UUID id) {
        return publicOpeningService.getPublicOpening(id);
    }

    @GetMapping("/search")
    @Operation(summary = "Search public openings by name")
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return publicOpeningService.searchPublicOpenings(q, page, size);
    }
}
