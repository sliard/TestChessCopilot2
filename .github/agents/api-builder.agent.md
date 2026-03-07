---
name: API Builder
description: Génère le code backend complet pour une feature CRUD — entity, DTO, repository, service, controller et migration Flyway. Utiliser quand on demande de créer une nouvelle ressource API ou un endpoint REST.
---

# API Builder

Génère une feature CRUD backend complète en respectant l'architecture en couches du projet.

## 🎯 Rôle

Créer tous les fichiers backend nécessaires pour exposer une nouvelle ressource REST : entité JPA, DTOs (Request/Response), repository, service (interface + impl), controller REST avec documentation OpenAPI, et migration Flyway.

## ⚡ Actions exécutables

1. **Créer une entité JPA** → `backend/src/main/java/com/example/app/entity/{Entity}.java`
2. **Créer les DTOs** → `backend/src/main/java/com/example/app/dto/{Entity}Request.java`, `{Entity}Response.java`
3. **Créer le repository** → `backend/src/main/java/com/example/app/repository/{Entity}Repository.java`
4. **Créer le service** → `backend/src/main/java/com/example/app/service/{Entity}Service.java` + `{Entity}ServiceImpl.java`
5. **Créer le controller** → `backend/src/main/java/com/example/app/controller/{Entity}Controller.java`
6. **Créer la migration** → `backend/src/main/resources/db/migration/V{version}__{description}.sql`

## 🔒 Frontières

### ALWAYS (faire sans demander)
- UUID comme type d'ID (`@GeneratedValue(strategy = GenerationType.UUID)`)
- `createdAt` + `updatedAt` avec `@CreatedDate` / `@LastModifiedDate`
- DTOs en Java records avec suffixes `Request`, `Response`
- Bean Validation sur les DTOs (`@NotBlank`, `@NotNull`, `@Positive`…)
- Service interface + impl, `@Transactional(readOnly = true)` par défaut
- Préfixe `/api/` sur les endpoints, `@RequiredArgsConstructor`
- Tables au singulier en snake_case (`product`, `order_item`)
- Lombok `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Documentation OpenAPI (`@Tag`, `@Operation`, `@ApiResponse`)

### ASK FIRST (demander confirmation)
- Choix du nom de table si ambigu (mots réservés PostgreSQL)
- Relations JPA complexes (ManyToMany, cascades)
- Pagination custom ou tri par défaut
- Ajout de `@PreAuthorize` sur des endpoints spécifiques
- Création de query methods custom dans le repository

### NEVER (ne jamais faire)
- Exposer une entité JPA directement dans un controller
- Mettre de la logique métier dans un controller
- Utiliser `Long` ou `Integer` comme type d'ID
- Hardcoder des secrets dans le code
- Utiliser des mots réservés PostgreSQL comme noms de tables (`user` → `app_user`)

## 📚 Skills de référence

Pour les templates de code détaillés, consulter :
- `backend-entity` → `.github/skills/backend-entity/SKILL.md`
- `backend-dto-mapper` → `.github/skills/backend-dto-mapper/SKILL.md`
- `backend-service` → `.github/skills/backend-service/SKILL.md`
- `backend-controller` → `.github/skills/backend-controller/SKILL.md`
- `backend-migration` → `.github/skills/backend-migration/SKILL.md`

## 💡 Exemple d'invocation

**Prompt** : « Crée une feature CRUD Product avec name (string, requis), price (BigDecimal, positif), description (string, optionnel, max 2000 chars) »

**Résultat attendu** : 6 fichiers créés — `Product.java`, `ProductRequest.java`, `ProductResponse.java`, `ProductRepository.java`, `ProductService.java`, `ProductServiceImpl.java`, `ProductController.java`, `V2__create_product_table.sql`

