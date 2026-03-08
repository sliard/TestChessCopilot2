package com.example.app.controller;

import com.example.app.dto.*;
import com.example.app.entity.User;
import com.example.app.service.UserOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/openings")
@RequiredArgsConstructor
@Tag(name = "User Openings", description = "Gestion des ouvertures de l'utilisateur connecté")
public class UserOpeningController {

    private final UserOpeningService userOpeningService;

    @GetMapping
    @Operation(summary = "Lister mes ouvertures")
    public PageResponse<UserOpeningListItemResponse> getMyOpenings(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String order,
            @RequestParam(required = false) String q) {
        var direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
        var pageable = PageRequest.of(page, size, Sort.by(direction, sort));
        return userOpeningService.getUserOpenings(user.getId(), q, pageable);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer une ouverture")
    public UserOpeningResponse createOpening(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateOpeningRequest request) {
        return userOpeningService.createOpening(user.getId(), request);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une de mes ouvertures")
    public UserOpeningResponse getOpening(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        return userOpeningService.getOpening(user.getId(), id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une de mes ouvertures")
    public UserOpeningResponse updateOpening(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOpeningRequest request) {
        return userOpeningService.updateOpening(user.getId(), id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer une de mes ouvertures")
    public void deleteOpening(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) {
        userOpeningService.deleteOpening(user.getId(), id);
    }

    @PatchMapping("/{id}/visibility")
    @Operation(summary = "Changer la visibilité d'une ouverture")
    public UserOpeningResponse updateVisibility(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVisibilityRequest request) {
        return userOpeningService.updateVisibility(user.getId(), id, request);
    }
}
