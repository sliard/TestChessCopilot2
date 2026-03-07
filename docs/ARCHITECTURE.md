# ARCHITECTURE.md

> Guide architectural pour la génération de code avec GitHub Copilot.  
> Ce fichier définit les patterns, structures et conventions à respecter.

---

## 🎯 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│  React 19 + TypeScript 5 + Vite 6                               │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌─────────┐            │
│  │  Pages  │→ │Components│→ │  Hooks  │→ │Services │            │
│  └─────────┘  └──────────┘  └─────────┘  └─────────┘            │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│  Java 21 + Spring Boot 3.4 + Spring Security 6                  │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐            │
│  │Controller│→ │ Service │→ │Repository│→ │ Entity │            │
│  └──────────┘  └─────────┘  └──────────┘  └────────┘            │
└────────────────────────────┬────────────────────────────────────┘
                             │ JDBC
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE                                  │
│  PostgreSQL 16                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ☕ Backend - Java 21 / Spring Boot 3.4.x

### Structure des Packages

```
com.example.app/
├── Application.java              # Point d'entrée @SpringBootApplication
├── config/                       # Configuration Spring
│   ├── SecurityConfig.java       # Spring Security
│   ├── JwtConfig.java            # Configuration JWT
│   ├── CorsConfig.java           # Configuration CORS
│   └── OpenApiConfig.java        # Documentation Swagger
├── controller/                   # REST Controllers
│   ├── AuthController.java
│   └── ProductController.java
├── dto/                          # Data Transfer Objects
│   ├── request/
│   │   ├── LoginRequest.java
│   │   └── ProductRequest.java
│   └── response/
│       ├── AuthResponse.java
│       └── ProductResponse.java
├── entity/                       # Entités JPA
│   ├── User.java
│   └── Product.java
├── repository/                   # Repositories Spring Data
│   ├── UserRepository.java
│   └── ProductRepository.java
├── service/                      # Services métier
│   ├── UserService.java
│   ├── UserServiceImpl.java
│   └── ProductService.java
├── security/                     # Sécurité JWT
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   └── UserDetailsServiceImpl.java
└── exception/                    # Gestion des erreurs
    ├── GlobalExceptionHandler.java
    ├── ResourceNotFoundException.java
    └── ErrorResponse.java
```

### Pattern Entity (JPA)

```java
@Entity
@Table(name = "product")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.DRAFT;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private Instant updatedAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false)
    private String createdBy;
}
```

**Règles obligatoires :**
- `@Id` avec `@GeneratedValue(strategy = GenerationType.UUID)`
- Timestamps `createdAt` et `updatedAt` avec `@CreatedDate` / `@LastModifiedDate`
- Table au **singulier** en snake_case : `@Table(name = "product")`
- Colonnes en snake_case sans majuscule : `@Column(name = "first_name")`
- ⚠️ Éviter les mots réservés PostgreSQL (ex : `app_user` au lieu de `user`)
- Lombok : `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Relations LAZY par défaut : `@ManyToOne(fetch = FetchType.LAZY)`

### Pattern DTO (Java Records)

```java
// Request DTO - avec validation
public record ProductRequest(
    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 255, message = "Le nom ne peut pas dépasser 255 caractères")
    String name,

    @Size(max = 1000)
    String description,

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    BigDecimal price,

    UUID categoryId
) {}

// Response DTO - données de sortie
public record ProductResponse(
    UUID id,
    String name,
    String description,
    BigDecimal price,
    String status,
    CategoryResponse category,
    Instant createdAt
) {
    // Factory method pour mapping
    public static ProductResponse from(Product product) {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getStatus().name(),
            product.getCategory() != null 
                ? CategoryResponse.from(product.getCategory()) 
                : null,
            product.getCreatedAt()
        );
    }
}

// Liste paginée
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isLast()
        );
    }
}
```

**Règles obligatoires :**
- Utiliser `record` Java 21
- Suffixes : `Request` pour entrées, `Response` pour sorties
- Validation Bean Validation sur les Request
- Factory method `from(Entity)` pour le mapping

### Pattern Repository

```java
public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Requêtes dérivées
    List<Product> findByStatus(ProductStatus status);
    
    Optional<Product> findByNameIgnoreCase(String name);
    
    boolean existsByNameIgnoreCase(String name);

    // Requêtes avec pagination
    Page<Product> findByCategory(Category category, Pageable pageable);

    // Requêtes JPQL
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(
        @Param("min") BigDecimal min, 
        @Param("max") BigDecimal max
    );

    // Requêtes avec JOIN FETCH (éviter N+1)
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE p.id = :id")
    Optional<Product> findByIdWithCategory(@Param("id") UUID id);

    // Requêtes de mise à jour
    @Modifying
    @Query("UPDATE Product p SET p.status = :status WHERE p.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("status") ProductStatus status);
}
```

### Pattern Service

```java
// Interface
public interface ProductService {
    PageResponse<ProductResponse> findAll(Pageable pageable);
    ProductResponse findById(UUID id);
    ProductResponse create(ProductRequest request);
    ProductResponse update(UUID id, ProductRequest request);
    void delete(UUID id);
}

// Implémentation
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public PageResponse<ProductResponse> findAll(Pageable pageable) {
        return PageResponse.from(
            productRepository.findAll(pageable).map(ProductResponse::from)
        );
    }

    @Override
    public ProductResponse findById(UUID id) {
        return productRepository.findById(id)
            .map(ProductResponse::from)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    @Override
    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = null;
        if (request.categoryId() != null) {
            category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.categoryId()));
        }

        var product = Product.builder()
            .name(request.name())
            .description(request.description())
            .price(request.price())
            .category(category)
            .status(ProductStatus.DRAFT)
            .build();

        return ProductResponse.from(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse update(UUID id, ProductRequest request) {
        var product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());

        return ProductResponse.from(productRepository.save(product));
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product", "id", id);
        }
        productRepository.deleteById(id);
    }
}
```

**Règles obligatoires :**
- Interface + Implémentation séparées
- `@Transactional(readOnly = true)` au niveau classe
- `@Transactional` sur les méthodes qui modifient
- `@RequiredArgsConstructor` pour l'injection
- Retourner des DTOs, jamais des entités

### Pattern Controller

```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "API de gestion des produits")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Liste tous les produits avec pagination")
    public ResponseEntity<PageResponse<ProductResponse>> findAll(
            @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupère un produit par son ID")
    public ResponseEntity<ProductResponse> findById(
            @PathVariable UUID id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crée un nouveau produit")
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(
            @Valid @RequestBody ProductRequest request) {
        return productService.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Met à jour un produit")
    public ResponseEntity<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprime un produit")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        productService.delete(id);
    }

    // Endpoint sécurisé avec rôle
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Publie un produit (Admin uniquement)")
    public ResponseEntity<ProductResponse> publish(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.publish(id));
    }

    // Accès à l'utilisateur connecté
    @GetMapping("/my-products")
    @Operation(summary = "Liste les produits de l'utilisateur connecté")
    public ResponseEntity<List<ProductResponse>> getMyProducts(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(productService.findByOwner(userDetails.getUsername()));
    }
}
```

**Règles obligatoires :**
- Préfixe `/api/` pour tous les endpoints
- `@Valid` sur les `@RequestBody`
- Documentation OpenAPI (`@Tag`, `@Operation`)
- Codes HTTP appropriés (201 pour POST, 204 pour DELETE)
- Pagination avec `Pageable` sur les listes

### Pattern Exception Handler

```java
public record ErrorResponse(
    String code,
    String message,
    Instant timestamp,
    String path,
    Map<String, String> details
) {
    public ErrorResponse(String code, String message, String path) {
        this(code, message, Instant.now(), path, null);
    }
}

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex, 
            HttpServletRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse("NOT_FOUND", ex.getMessage(), request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        var details = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value",
                (a, b) -> a
            ));
        
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(
                "VALIDATION_ERROR", 
                "Erreur de validation", 
                Instant.now(),
                request.getRequestURI(),
                details
            ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(new ErrorResponse("FORBIDDEN", "Accès refusé", request.getRequestURI()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(
            Exception ex,
            HttpServletRequest request) {
        log.error("Unexpected error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("INTERNAL_ERROR", "Erreur interne du serveur", request.getRequestURI()));
    }
}
```

### Configuration Spring Security + JWT

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Endpoints publics
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                // Endpoints admin
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Tout le reste nécessite une authentification
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

---

## ⚛️ Frontend - React 19 / TypeScript 5 / Vite 6

### Structure des Dossiers

```
src/
├── App.tsx                       # Composant racine + Router
├── main.tsx                      # Point d'entrée
├── vite-env.d.ts                 # Types Vite
├── index.css                     # Styles globaux
├── components/                   # Composants réutilisables
│   ├── ui/                       # Composants de base (Button, Input, Modal)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── layout/                   # Layout (Header, Footer, Sidebar)
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── features/                 # Composants métier
│       ├── ProductCard.tsx
│       └── ProductList.tsx
├── pages/                        # Pages/Routes
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   └── auth/
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   └── useLocalStorage.ts
├── services/                     # Appels API
│   ├── api.ts                    # Client HTTP de base
│   ├── authService.ts
│   └── productService.ts
├── store/                        # État global (si nécessaire)
│   └── authContext.tsx
├── types/                        # Types TypeScript
│   ├── auth.ts
│   ├── product.ts
│   └── common.ts
└── utils/                        # Utilitaires
    ├── formatters.ts
    └── validators.ts
```

### Pattern Types

```typescript
// types/common.ts
export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
  path: string;
  details?: Record<string, string>;
}

// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  status: ProductStatus;
  category: Category | null;
  createdAt: string;
}

export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
}

export interface Category {
  id: string;
  name: string;
}

// types/auth.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export type UserRole = 'USER' | 'ADMIN';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```

### Pattern Service API

```typescript
// services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.code || 'UNKNOWN_ERROR',
      error.message || 'Une erreur est survenue',
      error.details
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint: string) =>
    request<void>(endpoint, { method: 'DELETE' }),
};

export { ApiError };
```

```typescript
// services/productService.ts
import { api } from './api';
import type { Product, ProductRequest, Page } from '../types';

interface ProductFilters {
  page?: number;
  size?: number;
  sort?: string;
  status?: string;
  categoryId?: string;
}

export const productService = {
  findAll: (filters: ProductFilters = {}): Promise<Page<Product>> => {
    const params = new URLSearchParams();
    if (filters.page !== undefined) params.set('page', String(filters.page));
    if (filters.size !== undefined) params.set('size', String(filters.size));
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.status) params.set('status', filters.status);
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    
    const query = params.toString();
    return api.get<Page<Product>>(`/products${query ? `?${query}` : ''}`);
  },

  findById: (id: string): Promise<Product> =>
    api.get<Product>(`/products/${id}`),

  create: (data: ProductRequest): Promise<Product> =>
    api.post<Product>('/products', data),

  update: (id: string, data: ProductRequest): Promise<Product> =>
    api.put<Product>(`/products/${id}`, data),

  delete: (id: string): Promise<void> =>
    api.delete(`/products/${id}`),

  publish: (id: string): Promise<Product> =>
    api.post<Product>(`/products/${id}/publish`, {}),
};
```

### Pattern Hook

```typescript
// hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import type { Product, Page } from '../types';

interface UseProductsOptions {
  page?: number;
  size?: number;
  status?: string;
  autoFetch?: boolean;
}

interface UseProductsResult {
  products: Product[];
  page: Page<Product> | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsResult => {
  const { page = 0, size = 10, status, autoFetch = true } = options;
  
  const [data, setData] = useState<Page<Product> | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await productService.findAll({ page, size, status });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  }, [page, size, status]);

  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [fetchProducts, autoFetch]);

  return {
    products: data?.content ?? [],
    page: data,
    loading,
    error,
    refetch: fetchProducts,
    hasMore: data ? !data.last : false,
  };
};

// Hook pour un seul produit
export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await productService.findById(id);
        setProduct(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
```

```typescript
// hooks/useMutation.ts
import { useState, useCallback } from 'react';

interface UseMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

interface UseMutationResult<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  data: TData | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useMutation<TData, TVariables = void>(
  options: UseMutationOptions<TData, TVariables>
): UseMutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true);
      setError(null);
      const result = await options.mutationFn(variables);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      options.onError?.(error);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { mutate, data, loading, error, reset };
}
```

### Pattern Component

```tsx
// components/features/ProductCard.tsx
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showActions?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  return (
    <article className="product-card">
      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        
        {product.description && (
          <p className="product-card__description">{product.description}</p>
        )}
        
        <p className="product-card__price">{formatPrice(product.price)}</p>
        
        <span className={`product-card__status product-card__status--${product.status.toLowerCase()}`}>
          {product.status}
        </span>
      </div>

      {showActions && (
        <div className="product-card__actions">
          {onEdit && (
            <button 
              onClick={() => onEdit(product)}
              className="btn btn--secondary"
              aria-label={`Modifier ${product.name}`}
            >
              Modifier
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(product)}
              className="btn btn--danger"
              aria-label={`Supprimer ${product.name}`}
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </article>
  );
};
```

```tsx
// components/features/ProductList.tsx
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types';

interface ProductListProps {
  onProductClick?: (product: Product) => void;
  status?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  onProductClick,
  status,
}) => {
  const { products, loading, error, refetch } = useProducts({ status });

  if (loading) {
    return (
      <div className="product-list__loading" role="status">
        <span>Chargement des produits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list__error" role="alert">
        <p>Erreur : {error.message}</p>
        <button onClick={refetch} className="btn btn--primary">
          Réessayer
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-list__empty">
        <p>Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onProductClick}
        />
      ))}
    </div>
  );
};
```

### Pattern Auth Context

```tsx
// store/authContext.tsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token au démarrage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          setUser(user);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

```tsx
// components/auth/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

---

## 📋 Résumé des Conventions

### Backend

| Élément | Convention |
|---------|------------|
| ID | `UUID` avec `@GeneratedValue(strategy = GenerationType.UUID)` |
| Tables | **Singulier**, snake_case (`product`, `app_user`) |
| Colonnes | snake_case sans majuscule (`created_at`, `first_name`) |
| Timestamps | `createdAt`, `updatedAt` avec auditing |
| DTOs | Java Records avec suffixes `Request`/`Response` |
| Services | Interface + Impl, `@Transactional(readOnly = true)` |
| Endpoints | Préfixe `/api/`, ressources au pluriel |
| Validation | Bean Validation sur les Request DTOs |

### Frontend

| Élément | Convention |
|---------|------------|
| Composants | Functional, export nommé, PascalCase |
| Props | Interface avec suffixe `Props` |
| Hooks | Préfixe `use`, retour typé avec loading/error |
| Services | Objet avec méthodes async |
| Types | Interfaces pour modèles, types pour unions |
| État global | Context API avec hook personnalisé |

---

## 🔗 Références Rapides

### Codes HTTP

| Code | Utilisation |
|------|-------------|
| 200 | GET, PUT, PATCH réussis |
| 201 | POST création réussie |
| 204 | DELETE réussi |
| 400 | Erreur de validation |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

### Endpoints Standards

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste paginée |
| GET | `/api/products/{id}` | Détail |
| POST | `/api/products` | Création |
| PUT | `/api/products/{id}` | Mise à jour complète |
| PATCH | `/api/products/{id}` | Mise à jour partielle |
| DELETE | `/api/products/{id}` | Suppression |

