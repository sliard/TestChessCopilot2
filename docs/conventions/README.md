# 📚 Conventions de code

Ce dossier contient les conventions de code détaillées et des exemples complets pour chaque partie du stack technique.

## 📁 Structure

```
conventions/
├── backend.md     - Conventions Java/Spring Boot
├── frontend.md    - Conventions React/TypeScript
└── docker.md      - Conventions Docker/Infrastructure
```

## 🎯 Utilisation

### Pour les développeurs

Ces fichiers contiennent des **exemples de code complets** suivant les bonnes pratiques du projet.

**Quand les consulter** :
- ✅ Lors de la création d'une nouvelle feature
- ✅ Pour comprendre l'architecture du projet
- ✅ En cas de doute sur une convention
- ✅ Pour onboarding de nouveaux membres

### Pour GitHub Copilot

Ces fichiers sont **référencés** dans `.github/copilot-instructions.md` mais ne sont **pas chargés automatiquement** (pour respecter la limite de contexte).

**Comment les utiliser avec Copilot** :
1. Ouvrir le fichier concerné dans l'éditeur
2. Copilot aura alors accès au contexte complet
3. Demander à Copilot de générer du code similaire

### Pour les revues de code

Ces fichiers servent de **référence** lors des revues de code :
- ✅ Vérifier que le code suit les conventions
- ✅ Suggérer des améliorations basées sur les exemples
- ✅ Valider l'architecture proposée

## 📖 Fichiers

### backend.md

**Contenu** :
- Entités JPA avec UUID et timestamps
- DTOs avec Java records et validation
- Controllers REST avec OpenAPI
- Services avec interface et transactions
- Gestion d'erreurs globale
- Configuration Spring Security + JWT

**Technologies** : Java 21, Spring Boot 3.4.x, JPA, PostgreSQL 16

### frontend.md

**Contenu** :
- Composants React fonctionnels typés
- Hooks personnalisés avec loading/error/data
- Services API avec gestion d'erreurs
- Types et interfaces TypeScript
- Context d'authentification

**Technologies** : React 19, TypeScript 5.x, Vite 6.x

### docker.md

**Contenu** :
- Variables d'environnement (.env)
- Configuration Docker Compose
- Dockerfiles multi-stage
- Bonnes pratiques de build

**Technologies** : Docker, Docker Compose, Nginx

## 🔗 Références

Ces conventions sont un **complément** à :

1. **`.github/copilot-instructions.md`**  
   Règles critiques concises (lu automatiquement par Copilot)

2. **`.github/skills/`**  
   Templates de code prêts à l'emploi

3. **`docs/ARCHITECTURE.md`**  
   Architecture globale du projet

## ✅ Checklist d'utilisation

Lors de la création d'une nouvelle feature :

### Backend
- [ ] Lire `backend.md` pour les patterns
- [ ] Utiliser les skills dans `.github/skills/backend-*`
- [ ] Suivre les règles de `.github/copilot-instructions.md`

### Frontend
- [ ] Lire `frontend.md` pour les patterns
- [ ] Utiliser les skills dans `.github/skills/frontend-*`
- [ ] Suivre les règles de `.github/copilot-instructions.md`

### Infrastructure
- [ ] Lire `docker.md` pour la configuration
- [ ] Utiliser le skill `.github/skills/docker-compose`
- [ ] Mettre à jour `docker-compose.yml` si nécessaire

## 💡 Contribution

Pour améliorer ces conventions :

1. **Proposer des modifications** via PR
2. **Ajouter des exemples** si manquants
3. **Mettre à jour** si les technologies évoluent
4. **Garder la cohérence** avec `.github/copilot-instructions.md`

## 📊 Maintenance

Ces fichiers doivent être maintenus à jour :

| Quand | Action |
|-------|--------|
| Nouvelle techno | Ajouter des exemples |
| Pattern récurrent | Documenter le pattern |
| Erreur fréquente | Clarifier la convention |
| Migration version | Mettre à jour les exemples |

**Responsabilité** : Tech Lead + équipe

---

💡 **Astuce** : Utilisez la recherche (Ctrl+F) dans ces fichiers pour trouver rapidement un exemple spécifique !

