---
applyTo: "backend/**"
---

# Conventions Backend — Java 21 / Spring Boot 3.4.x

## Entités JPA

- **ID** : UUID obligatoire — `@GeneratedValue(strategy = GenerationType.UUID)`
- **Timestamps** : Toujours `createdAt` (`@CreatedDate`, `updatable = false`) + `updatedAt` (`@LastModifiedDate`)
- **Lombok** : `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- **Naming** : Table au **singulier** en snake_case (`product`, `order_item`), colonnes snake_case (`created_at`)
- Entité en PascalCase singulier

```java
@Entity
@Table(name = "product")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String name;
    @CreatedDate @Column(updatable = false)
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;
}
```

## DTOs

- Utiliser des **Java records**
- Suffixes : `Request`, `Response`, `ListResponse`
- **Bean Validation** sur les Request (`@NotBlank`, `@NotNull`, `@Positive`, `@Size`, etc.)

```java
public record ProductRequest(
    @NotBlank String name,
    @NotNull @Positive BigDecimal price
) {}

public record ProductResponse(UUID id, String name, BigDecimal price, Instant createdAt) {}
```

## Services

- **Interface + Implémentation** (`ProductService` → `ProductServiceImpl`)
- `@Transactional(readOnly = true)` au niveau classe
- `@Transactional` sur les méthodes qui modifient
- Injection par constructeur : `@RequiredArgsConstructor`
- Mapping entity ↔ DTO via méthode privée `toResponse()`

## Controllers

- Préfixe `/api/` pour tous les endpoints
- `@RequiredArgsConstructor` pour injection
- `ResponseEntity` pour réponses avec headers, `@ResponseStatus` sinon
- Documentation OpenAPI : `@Tag` sur la classe, `@Operation` sur les méthodes

## Gestion des erreurs

- `@RestControllerAdvice` pour gestion globale
- Exceptions métier custom (ex: `ResourceNotFoundException`)
- DTO `ErrorResponse` avec code + message

## Sécurité

- JWT stateless, sessions désactivées (`SessionCreationPolicy.STATELESS`)
- `/api/v1/auth/**`, `/api/v1/public/**` et `/actuator/health` : `permitAll()`
- Tout le reste : `authenticated()`

## Référence complète

Exemples de code détaillés : `docs/conventions/backend.md`
Skills templates : `.github/skills/backend-*/SKILL.md`
