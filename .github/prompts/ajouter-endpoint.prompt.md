---
name: ajouter-endpoint
description: Ajouter un endpoint REST à un controller existant
argument-hint: "controller=<nom> method=<GET|POST|PUT|DELETE> path=<chemin>"
agent: api-builder
---

# 🔌 Ajout d'Endpoint REST

## 📚 Contexte

Ajouter un nouvel endpoint REST à un controller existant en respectant les conventions Spring Boot et OpenAPI.

**Références** :
- [Conventions backend](../../docs/conventions/backend.md)
- [Skill backend-controller](../skills/backend-controller/SKILL.md)

## 🔧 Tâche

**Controller** : ${input:controller:nom du controller}  
**Méthode HTTP** : ${input:method:GET, POST, PUT, DELETE, PATCH}  
**Chemin** : ${input:path:/api/ressource/action}  
**Description** : ${input:description:description de l'endpoint}

## ✅ Checklist d'implémentation

### 1. Analyser l'endpoint

**Questions à se poser** :
- Quelle logique métier cette route expose-t-elle ?
- Quels paramètres sont nécessaires ? (path, query, body)
- Quel DTO utiliser en entrée/sortie ?
- Quel code de statut HTTP retourner ?
- Quelles erreurs peuvent survenir ?

### 2. Créer/Modifier le DTO (si nécessaire)

Si l'endpoint nécessite un nouveau DTO :

```java
// Request DTO
public record CustomActionRequest(
    @NotBlank(message = "Le champ est obligatoire")
    String champ1,
    
    @Positive(message = "Doit être positif")
    Integer champ2
) {}

// Response DTO
public record CustomActionResponse(
    UUID id,
    String resultat,
    Instant executedAt
) {}
```

**Règles** :
- ✅ Utiliser des **records** pour les DTOs
- ✅ Bean Validation sur les champs (`@NotBlank`, `@NotNull`, `@Email`, etc.)
- ✅ Messages d'erreur en français

### 3. Ajouter la méthode dans le Service

```java
// Interface
public interface ResourceService {
    CustomActionResponse executeCustomAction(UUID id, CustomActionRequest request);
}

// Implémentation
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceServiceImpl implements ResourceService {
    
    private final ResourceRepository repository;
    
    @Override
    @Transactional
    public CustomActionResponse executeCustomAction(UUID id, CustomActionRequest request) {
        Resource resource = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Resource non trouvée avec l'id: " + id));
        
        // Logique métier
        resource.doSomething(request.champ1());
        
        Resource updated = repository.save(resource);
        
        return new CustomActionResponse(
            updated.getId(),
            "Action effectuée",
            Instant.now()
        );
    }
}
```

**Règles** :
- ✅ Déclarer la méthode dans l'interface
- ✅ `@Transactional(readOnly=true)` sur la classe par défaut
- ✅ `@Transactional` sur les méthodes de mutation
- ✅ Lever des exceptions métier explicites

### 4. Ajouter l'endpoint dans le Controller

```java
@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@Tag(name = "Resources", description = "Gestion des ressources")
public class ResourceController {
    
    private final ResourceService service;
    
    @PostMapping("/{id}/custom-action")
    @Operation(
        summary = "Exécuter une action personnalisée",
        description = "Effectue une action spécifique sur la ressource identifiée"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Action exécutée avec succès",
            content = @Content(schema = @Schema(implementation = CustomActionResponse.class))
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Ressource non trouvée",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Requête invalide",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
        )
    })
    public ResponseEntity<CustomActionResponse> executeCustomAction(
            @Parameter(description = "ID de la ressource", required = true)
            @PathVariable UUID id,
            
            @Parameter(description = "Données de l'action", required = true)
            @Valid @RequestBody CustomActionRequest request
    ) {
        CustomActionResponse response = service.executeCustomAction(id, request);
        return ResponseEntity.ok(response);
    }
}
```

**Règles** :
- ✅ Annotations mapping : `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`
- ✅ Validation : `@Valid` sur les `@RequestBody`
- ✅ Documentation OpenAPI : `@Operation`, `@ApiResponses`, `@Parameter`, `@Schema`
- ✅ `ResponseEntity<T>` pour contrôler le code HTTP
- ✅ Path variables typés en `UUID` pour les IDs

### 5. Codes de statut HTTP appropriés

| Méthode | Scénario | Code HTTP | Méthode ResponseEntity |
|---------|----------|-----------|------------------------|
| POST | Création réussie | 201 Created | `ResponseEntity.created(location).body(response)` |
| GET | Lecture réussie | 200 OK | `ResponseEntity.ok(response)` |
| PUT/PATCH | Modification réussie | 200 OK | `ResponseEntity.ok(response)` |
| DELETE | Suppression réussie | 204 No Content | `ResponseEntity.noContent().build()` |
| * | Ressource non trouvée | 404 Not Found | Exception → GlobalExceptionHandler |
| * | Validation échouée | 400 Bad Request | Exception → GlobalExceptionHandler |
| * | Non autorisé | 401 Unauthorized | Spring Security |
| * | Interdit | 403 Forbidden | Spring Security |

### 6. Tests

#### Test unitaire du service
```java
@Test
void executeCustomAction_shouldSucceed() {
    // Given
    UUID id = UUID.randomUUID();
    CustomActionRequest request = new CustomActionRequest("value", 42);
    Resource resource = Resource.builder().id(id).build();
    
    when(repository.findById(id)).thenReturn(Optional.of(resource));
    when(repository.save(any())).thenReturn(resource);
    
    // When
    CustomActionResponse response = service.executeCustomAction(id, request);
    
    // Then
    assertNotNull(response);
    assertEquals(id, response.id());
    verify(repository).save(resource);
}
```

#### Test d'intégration du controller
```java
@Test
void executeCustomAction_shouldReturn200() throws Exception {
    // Given
    UUID id = UUID.randomUUID();
    CustomActionRequest request = new CustomActionRequest("value", 42);
    CustomActionResponse expectedResponse = new CustomActionResponse(id, "OK", Instant.now());
    
    when(service.executeCustomAction(any(), any())).thenReturn(expectedResponse);
    
    // When & Then
    mockMvc.perform(post("/api/resources/{id}/custom-action", id)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(id.toString()))
        .andExpect(jsonPath("$.resultat").value("OK"));
}
```

### 7. Vérifications finales

- [ ] La méthode du service est correctement annotée avec `@Transactional`
- [ ] L'endpoint est documenté avec OpenAPI (`@Operation`, `@ApiResponses`)
- [ ] La validation des paramètres est en place (`@Valid`, Bean Validation)
- [ ] Les codes HTTP retournés sont appropriés
- [ ] Les exceptions métier sont gérées
- [ ] Les tests unitaires et d'intégration sont ajoutés
- [ ] L'endpoint est testé manuellement (Swagger UI ou Postman)

## 📤 Résultat attendu

1. **Fichiers modifiés** :
   - `backend/src/main/java/com/example/app/controller/{Controller}.java`
   - `backend/src/main/java/com/example/app/service/{Service}.java`
   - `backend/src/main/java/com/example/app/service/{ServiceImpl}.java`
   - `backend/src/main/java/com/example/app/dto/{Request}.java` (si nouveau)
   - `backend/src/main/java/com/example/app/dto/{Response}.java` (si nouveau)

2. **Tests ajoutés** :
   - `backend/src/test/java/com/example/app/service/{ServiceImpl}Test.java`
   - `backend/src/test/java/com/example/app/controller/{Controller}Test.java`

3. **Documentation** :
   - Endpoint visible dans Swagger UI : `http://localhost:8080/swagger-ui.html`
   - Description et exemples complets

## 🎯 Exemples de cas d'usage

### Endpoint de recherche
- **Méthode** : GET
- **Path** : `/api/resources/search`
- **Query params** : `?keyword=...&status=...&page=0&size=20`
- **Response** : Page<ResourceResponse>

### Endpoint d'action métier
- **Méthode** : POST
- **Path** : `/api/resources/{id}/activate`
- **Body** : ActivateRequest (peut être vide)
- **Response** : ResourceResponse

### Endpoint d'agrégation
- **Méthode** : GET
- **Path** : `/api/resources/stats`
- **Response** : ResourceStatsResponse

### Endpoint de mise à jour partielle
- **Méthode** : PATCH
- **Path** : `/api/resources/{id}`
- **Body** : PatchResourceRequest (champs optionnels)
- **Response** : ResourceResponse
