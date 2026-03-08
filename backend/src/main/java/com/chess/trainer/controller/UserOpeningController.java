package com.chess.trainer.controller;

import com.chess.trainer.dto.request.CreateOpeningRequest;
import com.chess.trainer.dto.request.UpdateOpeningRequest;
import com.chess.trainer.dto.request.UpdateVisibilityRequest;
import com.chess.trainer.dto.response.PageResponse;
import com.chess.trainer.dto.response.UserOpeningListItemResponse;
import com.chess.trainer.dto.response.UserOpeningResponse;
import com.chess.trainer.entity.User;
import com.chess.trainer.repository.UserRepository;
import com.chess.trainer.service.UserOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/openings")
@RequiredArgsConstructor
@Tag(name = "User Openings", description = "Gestion des ouvertures de l'utilisateur connecté")
public class UserOpeningController {

    private final UserOpeningService userOpeningService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Lister mes ouvertures")
    public PageResponse<UserOpeningListItemResponse> getMyOpenings(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Numéro de page (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Nombre d'éléments par page") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Champ de tri") @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "desc") String order,
            @Parameter(description = "Recherche par nom") @RequestParam(required = false) String q) {
        UUID userId = resolveUserId(userDetails);
        Sort.Direction direction = "asc".equalsIgnoreCase(order) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return userOpeningService.getUserOpenings(userId, q, PageRequest.of(page, size, Sort.by(direction, sort)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer une ouverture")
    public UserOpeningResponse createOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateOpeningRequest request) {
        UUID userId = resolveUserId(userDetails);
        return userOpeningService.createOpening(userId, request);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une de mes ouvertures")
    public UserOpeningResponse getOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id) {
        UUID userId = resolveUserId(userDetails);
        return userOpeningService.getOpening(userId, id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une de mes ouvertures")
    public UserOpeningResponse updateOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOpeningRequest request) {
        UUID userId = resolveUserId(userDetails);
        return userOpeningService.updateOpening(userId, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer une de mes ouvertures")
    public void deleteOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id) {
        UUID userId = resolveUserId(userDetails);
        userOpeningService.deleteOpening(userId, id);
    }

    @PatchMapping("/{id}/visibility")
    @Operation(summary = "Changer la visibilité d'une ouverture")
    public UserOpeningResponse updateVisibility(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVisibilityRequest request) {
        UUID userId = resolveUserId(userDetails);
        return userOpeningService.updateVisibility(userId, id, request);
    }

    private UUID resolveUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userDetails.getUsername()));
    }
}
