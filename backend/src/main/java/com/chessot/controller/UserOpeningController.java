package com.chessot.controller;

import com.chessot.dto.request.OpeningRequest;
import com.chessot.dto.response.OpeningDetailResponse;
import com.chessot.dto.response.OpeningListItemResponse;
import com.chessot.dto.response.PageResponse;
import com.chessot.service.AuthService;
import com.chessot.service.UserOpeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/openings")
@RequiredArgsConstructor
@Tag(name = "User Openings", description = "Gestion des ouvertures personnelles")
public class UserOpeningController {

    private final UserOpeningService userOpeningService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "List user's openings",
            description = "Returns a paginated list of the authenticated user's openings")
    @ApiResponse(responseCode = "200", description = "Openings retrieved")
    @ApiResponse(responseCode = "401", description = "Not authenticated")
    public PageResponse<OpeningListItemResponse> getUserOpenings(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size) {

        UUID userId = resolveUserId(userDetails);
        return userOpeningService.getUserOpenings(userId, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user's opening",
            description = "Returns the details of a specific opening owned by the user")
    @ApiResponse(responseCode = "200", description = "Opening found")
    @ApiResponse(responseCode = "404", description = "Opening not found")
    public OpeningDetailResponse getUserOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Opening ID") @PathVariable UUID id) {

        UUID userId = resolveUserId(userDetails);
        return userOpeningService.getUserOpening(id, userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create an opening",
            description = "Creates a new opening for the authenticated user")
    @ApiResponse(responseCode = "201", description = "Opening created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public OpeningDetailResponse createOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OpeningRequest request) {

        UUID userId = resolveUserId(userDetails);
        return userOpeningService.createOpening(request, userId);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an opening",
            description = "Updates an existing opening owned by the user")
    @ApiResponse(responseCode = "200", description = "Opening updated")
    @ApiResponse(responseCode = "404", description = "Opening not found")
    public OpeningDetailResponse updateOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Opening ID") @PathVariable UUID id,
            @Valid @RequestBody OpeningRequest request) {

        UUID userId = resolveUserId(userDetails);
        return userOpeningService.updateOpening(id, request, userId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an opening",
            description = "Deletes an opening owned by the user")
    @ApiResponse(responseCode = "204", description = "Opening deleted")
    @ApiResponse(responseCode = "404", description = "Opening not found")
    public void deleteOpening(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Opening ID") @PathVariable UUID id) {

        UUID userId = resolveUserId(userDetails);
        userOpeningService.deleteOpening(id, userId);
    }

    @PatchMapping("/{id}/visibility")
    @Operation(summary = "Toggle opening visibility",
            description = "Toggles the public/private visibility of an opening")
    @ApiResponse(responseCode = "200", description = "Visibility toggled")
    @ApiResponse(responseCode = "404", description = "Opening not found")
    public OpeningDetailResponse toggleVisibility(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Opening ID") @PathVariable UUID id) {

        UUID userId = resolveUserId(userDetails);
        return userOpeningService.toggleVisibility(id, userId);
    }

    @GetMapping("/search")
    @Operation(summary = "Search user's openings",
            description = "Searches the user's openings with filters")
    @ApiResponse(responseCode = "200", description = "Search results retrieved")
    public PageResponse<OpeningListItemResponse> searchUserOpenings(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Search query (name)")
            @RequestParam(required = false) String q,
            @Parameter(description = "ECO code filter")
            @RequestParam(required = false) String ecoCode,
            @Parameter(description = "Moves prefix filter")
            @RequestParam(required = false) String moves,
            @Parameter(description = "Visibility filter (all, public, private)")
            @RequestParam(defaultValue = "all") String visibility,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Sort field (createdAt, name, ecoCode)")
            @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "Sort order (asc, desc)")
            @RequestParam(defaultValue = "desc") String order) {

        UUID userId = resolveUserId(userDetails);
        return userOpeningService.searchUserOpenings(
                userId, q, ecoCode, moves, visibility, page, size, sort, order);
    }

    private UUID resolveUserId(UserDetails userDetails) {
        return authService.getUserIdByEmail(userDetails.getUsername());
    }
}
