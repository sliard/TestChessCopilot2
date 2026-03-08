package com.chess.trainer.controller;

import com.chess.trainer.dto.response.OpeningDetailResponse;
import com.chess.trainer.dto.response.OpeningListItemResponse;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.service.PublicOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
    @Operation(summary = "List and search public openings with optional filters, sorting, and pagination")
    public PageResponse<OpeningListItemResponse> getPublicOpenings(
            @Parameter(description = "Search by opening name") @RequestParam(required = false) String q,
            @Parameter(description = "Filter by ECO code prefix (e.g. B20)") @RequestParam(required = false) String ecoCode,
            @Parameter(description = "Filter by move sequence prefix") @RequestParam(required = false) String moves,
            @Parameter(description = "Sort field: createdAt, updatedAt, name") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort direction: asc or desc") @RequestParam(defaultValue = "desc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return publicOpeningService.searchPublicOpenings(q, ecoCode, moves, sort, order, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get public opening details")
    public OpeningDetailResponse getPublicOpening(@PathVariable UUID id) {
        return publicOpeningService.getPublicOpening(id);
    }
}
