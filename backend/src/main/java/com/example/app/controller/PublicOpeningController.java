package com.example.app.controller;

import com.example.app.dto.OpeningDetailResponse;
import com.example.app.dto.OpeningListItemResponse;
import com.example.app.dto.PageResponse;
import com.example.app.service.PublicOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/openings")
@RequiredArgsConstructor
@Tag(name = "Public Openings", description = "Consultation publique des ouvertures d'échecs")
public class PublicOpeningController {

    private final PublicOpeningService publicOpeningService;

    private static final List<String> ALLOWED_SORT_FIELDS = List.of("createdAt", "updatedAt", "name");

    @Operation(summary = "Liste paginée des ouvertures publiques avec filtres optionnels")
    @GetMapping
    public PageResponse<OpeningListItemResponse> getPublicOpenings(
            @Parameter(description = "Recherche par nom") @RequestParam(required = false) String q,
            @Parameter(description = "Filtre par code ECO (préfixe)") @RequestParam(required = false) String ecoCode,
            @Parameter(description = "Filtre par coups (préfixe)") @RequestParam(required = false) String moves,
            @Parameter(description = "Champ de tri (createdAt, updatedAt, name)") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Ordre de tri (asc, desc)") @RequestParam(defaultValue = "desc") String order,
            @Parameter(description = "Numéro de page (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page") @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, buildSort(sort, order));
        boolean hasFilters = q != null || ecoCode != null || moves != null;
        if (hasFilters) {
            return publicOpeningService.searchPublicOpenings(q, ecoCode, moves, pageable);
        }
        return publicOpeningService.getPublicOpenings(pageable);
    }

    @Operation(summary = "Détail d'une ouverture publique")
    @GetMapping("/{id}")
    public OpeningDetailResponse getPublicOpening(
            @Parameter(description = "ID de l'ouverture") @PathVariable UUID id) {
        return publicOpeningService.getPublicOpening(id);
    }

    @Operation(summary = "Recherche d'ouvertures publiques par nom, code ECO et coups")
    @GetMapping("/search")
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            @Parameter(description = "Terme de recherche") @RequestParam String q,
            @Parameter(description = "Filtre par code ECO (préfixe)") @RequestParam(required = false) String ecoCode,
            @Parameter(description = "Filtre par coups (préfixe)") @RequestParam(required = false) String moves,
            @Parameter(description = "Champ de tri (createdAt, updatedAt, name)") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Ordre de tri (asc, desc)") @RequestParam(defaultValue = "desc") String order,
            @Parameter(description = "Numéro de page (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page") @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, buildSort(sort, order));
        if (ecoCode != null || moves != null) {
            return publicOpeningService.searchPublicOpenings(q, ecoCode, moves, pageable);
        }
        return publicOpeningService.searchPublicOpenings(q, pageable);
    }

    private Sort buildSort(String sort, String order) {
        var sortField = ALLOWED_SORT_FIELDS.contains(sort) ? sort : "createdAt";
        var direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(direction, sortField);
    }
}
