package com.example.app.controller;

import com.example.app.dto.OpeningDetailResponse;
import com.example.app.dto.OpeningListItemResponse;
import com.example.app.dto.PageResponse;
import com.example.app.service.PublicOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/openings")
@RequiredArgsConstructor
@Tag(name = "Public Openings", description = "Consultation publique des ouvertures d'échecs")
public class PublicOpeningController {

    private final PublicOpeningService publicOpeningService;

    @GetMapping
    @Operation(summary = "Liste paginée des ouvertures publiques")
    public PageResponse<OpeningListItemResponse> getPublicOpenings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String order) {
        var direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
        var pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return publicOpeningService.getPublicOpenings(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une ouverture publique")
    public OpeningDetailResponse getPublicOpening(@PathVariable UUID id) {
        return publicOpeningService.getPublicOpening(id);
    }

    @GetMapping("/search")
    @Operation(summary = "Recherche d'ouvertures publiques")
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String ecoCode,
            @RequestParam(required = false) String moves,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String order) {
        var direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
        var pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return publicOpeningService.searchPublicOpenings(q, ecoCode, moves, pageable);
    }
}
