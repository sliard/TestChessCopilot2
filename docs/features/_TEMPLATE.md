# Feature : [Nom de la Feature]

> 📝 **Statut** : Draft | Ready | In Progress | Done | Cancelled
> 
> 📅 **Date de création** : YYYY-MM-DD
> 
> 👤 **Auteur** : [Nom]

## 📋 Résumé

_Description courte de la feature en 2-3 phrases._

## 🎯 Objectifs

- [ ] Objectif 1
- [ ] Objectif 2
- [ ] Objectif 3

## 👥 User Stories

### US1 : [Titre]
**En tant que** [type d'utilisateur],  
**je veux** [action/fonctionnalité],  
**afin de** [bénéfice/valeur].

**Critères d'acceptation :**
- [ ] Critère 1
- [ ] Critère 2

### US2 : [Titre]
**En tant que** [type d'utilisateur],  
**je veux** [action/fonctionnalité],  
**afin de** [bénéfice/valeur].

**Critères d'acceptation :**
- [ ] Critère 1
- [ ] Critère 2

## 🏗️ Conception technique

### Backend

#### Entités
```
EntityName
├── id: UUID
├── field1: Type
├── field2: Type
└── timestamps (createdAt, updatedAt)
```

#### Endpoints API
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/v1/resource` | Liste des ressources | ✅ |
| POST | `/api/v1/resource` | Créer une ressource | ✅ |
| GET | `/api/v1/resource/{id}` | Détail d'une ressource | ✅ |
| PUT | `/api/v1/resource/{id}` | Modifier une ressource | ✅ |
| DELETE | `/api/v1/resource/{id}` | Supprimer une ressource | ✅ |

#### Services
- `ResourceService` : Logique métier principale

### Frontend

#### Composants
- `ResourceList` : Liste des ressources avec pagination
- `ResourceForm` : Formulaire de création/édition
- `ResourceCard` : Carte d'affichage d'une ressource

#### Routes
| Route | Composant | Description |
|-------|-----------|-------------|
| `/resources` | ResourceListPage | Liste des ressources |
| `/resources/new` | ResourceFormPage | Création |
| `/resources/:id` | ResourceDetailPage | Détail |
| `/resources/:id/edit` | ResourceFormPage | Édition |

## 🎨 Maquettes / Wireframes

_Ajouter des liens vers les maquettes ou des descriptions visuelles._

## 📊 Données de test

```json
{
  "example": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

## ⚠️ Risques et dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| - | - | - |

## 📝 Notes

_Notes additionnelles, questions ouvertes, décisions à prendre._

## ✅ Definition of Done

- [ ] Code implémenté et testé
- [ ] Tests unitaires (>80% couverture)
- [ ] Tests d'intégration
- [ ] Documentation API (OpenAPI)
- [ ] Code review effectué
- [ ] Déployé en environnement de test

