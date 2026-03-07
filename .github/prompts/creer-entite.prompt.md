---
name: creer-entite
description: Créer une entité JPA avec repository et migration Flyway
argument-hint: "entity=<nom> fields=<champ1:type,champ2:type>"
agent: db-migrator
---

# 🗄️ Création d'Entité JPA

## 📚 Contexte

Créer une nouvelle entité JPA selon les conventions du projet :
- [Conventions backend](../../docs/conventions/backend.md)
- [Architecture du projet](../../docs/ARCHITECTURE.md)
- [Règles des agents](../../AGENTS.md)

## 🔧 Tâche

**Entité à créer** : ${input:entity:nom de l'entité}  
**Champs** : ${input:fields:champ1:Type,champ2:Type,champ3:Type}

## ✅ Checklist d'implémentation

### 1. Entité JPA (`backend/src/main/java/com/example/app/entity/`)

```java
@Entity
@Table(name = "nom_table_snake_case")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class NomEntite {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // Champs métier avec validation JPA
    @Column(nullable = false, length = 100)
    private String champExemple;
    
    // Timestamps automatiques
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}
```

**Règles importantes** :
- ✅ ID en **UUID** (`@GeneratedValue(strategy = GenerationType.UUID)`)
- ✅ Table au **singulier** en **snake_case** (éviter les mots réservés PostgreSQL : `user` → `app_user`)
- ✅ Timestamps **obligatoires** : `createdAt` + `updatedAt`
- ✅ Annotations Lombok : `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`
- ✅ Contraintes SQL via JPA : `@Column(nullable=false)`, `@Size`, `@Email`, etc.

### 2. Repository (`backend/src/main/java/com/example/app/repository/`)

```java
public interface NomEntiteRepository extends JpaRepository<NomEntite, UUID> {
    
    // Méthodes de requête dérivées
    Optional<NomEntite> findByChamp(String champ);
    
    List<NomEntite> findByChampContainingIgnoreCase(String keyword);
    
    boolean existsByChamp(String champ);
}
```

**Règles** :
- ✅ Hériter de `JpaRepository<Entity, UUID>`
- ✅ Utiliser les méthodes dérivées Spring Data JPA
- ✅ Méthodes `Optional<>` pour les résultats uniques
- ✅ Méthodes `exists*` pour les vérifications

### 3. Migration Flyway (`backend/src/main/resources/db/migration/`)

**Fichier** : `V{n}__create_{nom_table}.sql`

```sql
CREATE TABLE nom_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    champ_exemple VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_nom_table_champ_exemple ON nom_table(champ_exemple);

-- Commentaires pour la documentation
COMMENT ON TABLE nom_table IS 'Description de la table';
COMMENT ON COLUMN nom_table.champ_exemple IS 'Description du champ';
```

**Règles** :
- ✅ Nommage : `V{n}__description.sql` (double underscore !)
- ✅ Colonnes en **snake_case**
- ✅ `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- ✅ Timestamps avec `DEFAULT CURRENT_TIMESTAMP`
- ✅ Contraintes : `NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`
- ✅ Index sur les champs fréquemment recherchés

### 4. Vérifications

- [ ] L'entité compile sans erreur
- [ ] Le repository hérite de `JpaRepository<Entity, UUID>`
- [ ] La migration Flyway respecte la convention de nommage
- [ ] Les types SQL correspondent aux types Java
- [ ] Les contraintes SQL sont cohérentes avec les annotations JPA
- [ ] La table n'utilise pas de mot réservé PostgreSQL

## 📤 Résultat attendu

1. **Fichiers créés** :
   - `backend/src/main/java/com/example/app/entity/{NomEntite}.java`
   - `backend/src/main/java/com/example/app/repository/{NomEntite}Repository.java`
   - `backend/src/main/resources/db/migration/V{n}__create_{nom_table}.sql`

2. **Résumé** :
   - Nom de la table et colonnes créées
   - Index ajoutés
   - Relations avec d'autres entités (si applicable)

3. **Prochaines étapes** :
   - Créer les DTOs Request/Response
   - Implémenter le service métier
   - Créer le controller REST
