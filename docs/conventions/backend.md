# Conventions Backend (Java/Spring Boot)

## Entités JPA

```java
@Entity
@Table(name = "product")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
```

**Règles :**
- Utiliser UUID comme type d'ID
- Toujours inclure `createdAt` et `updatedAt`
- Utiliser `@Data` de Lombok
- Nommer les tables au **singulier** en snake_case

## DTOs

```java
public record ProductRequest(
    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255)
    String name,

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    BigDecimal price
) {}

public record ProductResponse(
    UUID id,
    String name,
    BigDecimal price,
    Instant createdAt
) {}
```

**Règles :**
- Utiliser des records Java
- Suffixes : `Request`, `Response`, `ListResponse`
- Validation avec Bean Validation

## Controllers

```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Gestion des produits")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> findAll(Pageable pageable) {
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }
}
```

**Règles :**
- Préfixer les endpoints avec `/api/`
- Utiliser `ResponseEntity` pour les réponses avec headers
- Injection par constructeur avec `@RequiredArgsConstructor`
- Documentation OpenAPI avec `@Tag` et `@Operation`

## Services

```java
public interface ProductService {
    Page<ProductResponse> findAll(Pageable pageable);
    ProductResponse create(ProductRequest request);
}

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    public Page<ProductResponse> findAll(Pageable pageable) {
        return productRepository.findAll(pageable)
            .map(this::toResponse);
    }

    @Override
    @Transactional
    public ProductResponse create(ProductRequest request) {
        var product = Product.builder()
            .name(request.name())
            .price(request.price())
            .build();
        return toResponse(productRepository.save(product));
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getPrice(),
            product.getCreatedAt()
        );
    }
}
```

**Règles :**
- Interface + Implémentation
- `@Transactional(readOnly = true)` par défaut
- `@Transactional` sur les méthodes qui modifient

## Gestion des erreurs

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        var errors = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList();
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("VALIDATION_ERROR", String.join(", ", errors)));
    }
}
```

## Spring Security + JWT

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```
