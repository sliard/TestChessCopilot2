package com.chessot.controller;

import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;
import com.chessot.service.PublicOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@Tag(name = "Public Openings", description = "Ouvertures publiques accessibles à tous")
public class PublicOpeningController {

    private final PublicOpeningService publicOpeningService;

    @GetMapping
    @Operation(summary = "List public openings",
            description = "Returns a paginated list of all public openings")
    @ApiResponse(responseCode = "200", description = "Public openings retrieved")
    public PageResponse<OpeningListItemResponse> getPublicOpenings(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field (createdAt, name, ecoCode)")
            @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort order (asc, desc)")
            @RequestParam(defaultValue = "desc") String order) {

        return publicOpeningService.getPublicOpenings(page, size, sort, order);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a public opening",
            description = "Returns the details of a specific public opening")
    @ApiResponse(responseCode = "200", description = "Opening found")
    @ApiResponse(responseCode = "404", description = "Opening not found")
    public OpeningDetailResponse getPublicOpening(
            @Parameter(description = "Opening ID") @PathVariable UUID id) {

        return publicOpeningService.getPublicOpening(id);
    }

    @GetMapping("/search")
    @Operation(summary = "Search public openings",
            description = "Searches public openings by name, ECO code, or moves")
    @ApiResponse(responseCode = "200", description = "Search results retrieved")
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            @Parameter(description = "Search query (name)")
            @RequestParam(required = false) String q,
            @Parameter(description = "ECO code filter")
            @RequestParam(required = false) String ecoCode,
            @Parameter(description = "Moves prefix filter")
            @RequestParam(required = false) String moves,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field (createdAt, name, ecoCode)")
            @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort order (asc, desc)")
            @RequestParam(defaultValue = "desc") String order) {

        return publicOpeningService.searchPublicOpenings(
                q, ecoCode, moves, page, size, sort, order);
    }
}
