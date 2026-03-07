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

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/public/openings")
@RequiredArgsConstructor
@Tag(name = "Public Openings", description = "Consultation publique des ouvertures d'échecs")
public class PublicOpeningController {

    private final PublicOpeningService publicOpeningService;

    @Operation(summary = "Liste paginée des ouvertures publiques")
    @GetMapping
    public PageResponse<OpeningListItemResponse> getPublicOpenings(
            @Parameter(description = "Numéro de page (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page") @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return publicOpeningService.getPublicOpenings(pageable);
    }

    @Operation(summary = "Détail d'une ouverture publique")
    @GetMapping("/{id}")
    public OpeningDetailResponse getPublicOpening(
            @Parameter(description = "ID de l'ouverture") @PathVariable UUID id) {
        return publicOpeningService.getPublicOpening(id);
    }

    @Operation(summary = "Recherche d'ouvertures publiques par nom")
    @GetMapping("/search")
    public PageResponse<OpeningListItemResponse> searchPublicOpenings(
            @Parameter(description = "Terme de recherche") @RequestParam String q,
            @Parameter(description = "Numéro de page (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Taille de la page") @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return publicOpeningService.searchPublicOpenings(q, pageable);
    }
}
