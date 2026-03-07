---
applyTo: "backend/src/test/**,frontend/src/**/*.test.*,frontend/src/**/*.spec.*"
---

# Conventions de Tests

## Backend — JUnit 5 / Mockito / Testcontainers

### Tests unitaires (services)

- `@ExtendWith(MockitoExtension.class)`
- `@Mock` pour les dépendances, `@InjectMocks` pour le service
- Nommage : `should_expectedBehavior_when_condition()`
- Pattern AAA : Arrange / Act / Assert

```java
@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {
    @Mock private ProductRepository productRepository;
    @InjectMocks private ProductServiceImpl productService;

    @Test
    void should_returnProduct_when_validRequest() {
        // Arrange
        var request = new ProductRequest("Test", BigDecimal.TEN);
        when(productRepository.save(any())).thenReturn(Product.builder().id(UUID.randomUUID()).name("Test").build());
        // Act
        var result = productService.create(request);
        // Assert
        assertThat(result.name()).isEqualTo("Test");
    }
}
```

### Tests d'intégration (controllers)

- `@WebMvcTest` pour tester les controllers isolément
- `@MockBean` pour mocker les services
- `MockMvc` pour simuler les requêtes HTTP
- Vérifier status codes, body JSON, headers

### Tests d'intégration (repository / full)

- **Testcontainers** avec PostgreSQL pour un vrai environnement DB
- `@SpringBootTest` + `@Testcontainers`
- `@Container` avec `PostgreSQLContainer`

## Frontend — Vitest / Testing Library / MSW

### Tests de composants

- `@testing-library/react` : `render`, `screen`, `userEvent`
- Tester le comportement utilisateur, pas l'implémentation
- `describe` / `it` pour structurer

```tsx
describe('ProductCard', () => {
  it('should display product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

### Tests de hooks

- `renderHook` de `@testing-library/react`
- `waitFor` pour les effets asynchrones

### Mocks API

- **MSW** (Mock Service Worker) pour intercepter les requêtes réseau
- Handlers dans un fichier dédié (`src/mocks/handlers.ts`)

## Référence complète

Skills templates : `.github/skills/backend-testing/SKILL.md`, `.github/skills/frontend-testing/SKILL.md`

