# 🎯 Concept du Projet

> 📝 **Statut** : Draft
>
> 📅 **Date de création** : 2026-02-15
>
> 👤 **Auteur** : Équipe Chess Training

---

## 📋 Vision du Projet

### Nom du projet
**Chess Openings Trainer** (ChessOT)

### Pitch
Une plateforme web interactive permettant aux joueurs d'échecs de découvrir, étudier et mémoriser les ouvertures d'échecs, accessible à tous avec un mode publique et enrichie de fonctionnalités privées pour les utilisateurs inscrits.

### Problème résolu
Les joueurs d'échecs ont besoin de maîtriser les ouvertures pour améliorer leur jeu, mais les ressources existantes sont souvent :
- Dispersées sur différentes plateformes
- Difficiles à mémoriser sans répétition espacée
- Peu interactives et engageantes
- Sans possibilité de personnalisation

Ce projet offre un espace unifié pour explorer les ouvertures populaires publiquement et créer ses propres répertoires d'ouvertures personnalisés.

### Proposition de valeur
- **Accessible** : Mode publique sans inscription pour découvrir les ouvertures classiques
- **Personnalisable** : Création d'ouvertures privées pour travailler ses propres variantes
- **Communautaire** : Partage d'ouvertures publiques entre utilisateurs
- **Progressive** : Démarrer sans compte, puis s'inscrire pour débloquer plus de fonctionnalités

---

## 🏢 Domaine Métier

### Contexte
Le domaine des échecs est riche en terminologie et concepts. Ce projet se concentre sur l'étude et l'apprentissage des ouvertures, c'est-à-dire les premiers coups d'une partie d'échecs. Les joueurs cherchent à mémoriser des séquences de coups (variantes) pour obtenir un avantage ou égaliser la position.

### Glossaire

| Terme | Définition |
|-------|------------|
| **Ouverture** | Séquence de coups jouée au début d'une partie d'échecs (généralement les 10-15 premiers coups) |
| **Variante** | Une branche spécifique d'une ouverture, définissant un ensemble de coups précis |
| **Ligne principale** | La séquence de coups la plus courante ou recommandée dans une ouverture |
| **Coup** | Un mouvement d'une pièce sur l'échiquier, noté en notation algébrique (ex: e4, Nf3) |
| **Notation algébrique** | Système standard pour noter les coups d'échecs (ex: 1.e4 e5 2.Nf3 Nc6) |
| **Répertoire** | Collection d'ouvertures qu'un joueur maîtrise et utilise régulièrement |
| **Position** | État de l'échiquier à un moment donné (disposition des pièces) |
| **ECO (Encyclopedia of Chess Openings)** | Code de classification des ouvertures (ex: B90 pour la Défense Sicilienne Najdorf) |

### Règles métier principales

1. **Visibilité des ouvertures** : Les ouvertures peuvent être publiques (visibles par tous) ou privées (visibles uniquement par leur créateur)
2. **Accès anonyme** : Les visiteurs non authentifiés peuvent uniquement consulter les ouvertures publiques en lecture seule
3. **Droits des utilisateurs authentifiés** : Seuls les utilisateurs connectés peuvent créer, modifier et supprimer leurs propres ouvertures
4. **Propriété des ouvertures** : Chaque ouverture appartient à un utilisateur ou est considérée comme "système" (créée par l'équipe)
5. **Intégrité des coups** : Les séquences de coups doivent respecter les règles des échecs (coups légaux)

---

## 👥 Personas

### Persona 1 : Visiteur Anonyme

| Attribut | Description |
|----------|-------------|
| **Rôle** | Joueur d'échecs débutant ou curieux découvrant la plateforme |
| **Objectifs** | - Découvrir les ouvertures classiques<br>- Comprendre les principes de base des ouvertures<br>- Décider si l'inscription vaut le coup |
| **Frustrations** | - Pas de possibilité de sauvegarder ses ouvertures préférées<br>- Accès limité au contenu<br>- Pas de personnalisation |
| **Besoins** | - Interface simple et claire<br>- Visualisation interactive de l'échiquier<br>- Ouvertures bien expliquées<br>- Possibilité de s'inscrire facilement |

### Persona 2 : Joueur Enregistré

| Attribut | Description |
|----------|-------------|
| **Rôle** | Joueur d'échecs régulier souhaitant améliorer son répertoire d'ouvertures |
| **Objectifs** | - Créer et organiser son répertoire personnel<br>- Étudier des variantes spécifiques<br>- Sauvegarder ses analyses<br>- Partager ses découvertes avec la communauté |
| **Frustrations** | - Oublier les variantes étudiées<br>- Difficultés à organiser ses connaissances<br>- Manque de suivi de progression |
| **Besoins** | - Création d'ouvertures privées<br>- Organisation en collections<br>- Notes personnelles sur les positions<br>- Possibilité de rendre publiques certaines ouvertures |

### Persona 3 : Administrateur du service

| Attribut | Description                                                                                                                 |
|----------|-----------------------------------------------------------------------------------------------------------------------------|
| **Rôle** | Administrateur pour la partie technique du service                                                                          |
| **Objectifs** | - Contribuer à la bibliothèque publique<br>- Créer des ressources pédagogiques<br>- Aider la communauté<br>                 |
| **Besoins** | - Outils de gestion des comptes<br>- Système de catégorisation<br>- Statistiques de consultation<br>- Modération et qualité |

---

## 🚀 Features Principales

| # | Feature | Description | Priorité | Spec |
|---|---------|-------------|----------|------|
| 1 | Authentification utilisateur | Inscription, connexion, gestion de compte | 🔴 Haute | [001-user-authentication.md](./docs/features/001-user-authentication.md) |
| 2 | Navigation publique des ouvertures | Consultation des ouvertures publiques sans compte | 🔴 Haute | [002-public-openings-browsing.md](./docs/features/002-public-openings-browsing.md) |
| 3 | Gestion des ouvertures | CRUD des ouvertures (privées/publiques) pour utilisateurs connectés | 🔴 Haute | [003-opening-management.md](./docs/features/003-opening-management.md) |
| 4 | Échiquier interactif | Visualisation et navigation dans les coups d'une ouverture | 🔴 Haute | [004-interactive-chessboard.md](./docs/features/004-interactive-chessboard.md) |
| 5 | Recherche et filtrage | Recherche d'ouvertures par nom, code ECO, coups | 🟡 Moyenne | [005-search-filtering.md](./docs/features/005-search-filtering.md) |
| 6 | Collections personnelles | Organisation des ouvertures en répertoires | 🟡 Moyenne | - |
| 7 | Système de notation | Ajout de notes et commentaires sur les positions | 🟡 Moyenne | - |
| 8 | Mode entraînement | Entraînement avec répétition espacée | 🟢 Basse | - |

### Priorisation

- 🔴 **Haute** : Indispensable pour le MVP
- 🟡 **Moyenne** : Important mais peut attendre la V1.1
- 🟢 **Basse** : Nice to have pour versions ultérieures

---

## 🎯 MVP (Minimum Viable Product)

### Périmètre du MVP

Le MVP se concentre sur les fonctionnalités essentielles permettant :
1. La découverte publique des ouvertures
2. La création de compte et gestion d'identité
3. La création et gestion d'ouvertures privées/publiques
4. La visualisation interactive sur échiquier

- [x] Authentification utilisateur (inscription, connexion, profil)
- [x] Navigation publique des ouvertures (lecture seule pour visiteurs)
- [x] Gestion CRUD des ouvertures avec visibilité publique/privée
- [x] Échiquier interactif pour visualiser les coups
- [x] Interface responsive (desktop + mobile)

### Hors périmètre (V1)

Les fonctionnalités suivantes sont reportées aux versions ultérieures :

- Collections et organisation avancée (V1.1)
- Système de commentaires et annotations détaillées (V1.1)
- Mode entraînement avec répétition espacée (V1.2)
- Statistiques de progression (V1.2)
- Import/Export PGN (V1.3)
- Analyse par moteur (V2.0)
- Système de notation par la communauté (V2.0)
- API publique (V2.0)

### Critères de succès

| Critère | Objectif MVP |
|---------|--------------|
| Utilisateurs inscrits | 50+ utilisateurs dans les 2 premiers mois |
| Ouvertures publiques | 20+ ouvertures de qualité dans la bibliothèque |
| Temps de réponse API | < 300ms pour 95% des requêtes |
| Taux de conversion (visiteur → inscrit) | > 10% après consultation de 3+ ouvertures |
| Satisfaction utilisateur | > 4/5 sur formulaire de feedback |

---

## ⚠️ Contraintes

### Techniques

- Stack imposée : Java 21 + Spring Boot 3.4.x (backend), React 19 + Vite 6.x (frontend)
- Base de données : PostgreSQL 16
- Hébergement : Docker containers
- Validation des coups : Nécessite une librairie d'échecs (ex: chess.js côté frontend)
- Notation : Support de la notation algébrique standard

### Légales / Conformité

- RGPD : Consentement utilisateur, droit à l'oubli, export des données
- CGU : Propriété intellectuelle des ouvertures créées
- Modération : Contenu inapproprié dans les noms/descriptions

### Performance

- Temps de réponse : < 300ms pour le chargement d'une ouverture
- Charge : Support de 100 utilisateurs simultanés pour le MVP
- Taille : Limiter les ouvertures à 50 coups maximum par défaut

### Budget / Délais

- Timeline : MVP fonctionnel en 6 semaines
- Ressources : 1 développeur fullstack
- Infrastructure : Gratuite (Docker local + GitHub)

---

## 🔗 Ressources

### Documentation liée

- [Architecture technique](./docs/ARCHITECTURE.md)
- [Contexte IA](./docs/AI_CONTEXT.md)
- [Backlog des features](./docs/README.md)

### Références externes

- [Lichess - Site d'échecs open-source](https://lichess.org)
- [Chess.com - Plateforme de référence](https://www.chess.com/openings)
- [Chessable - Entraînement aux ouvertures](https://www.chessable.com)
- [Chess.js - Librairie JavaScript](https://github.com/jhlywa/chess.js)
- [react-chessboard - Composant React](https://www.npmjs.com/package/react-chessboard)
- [ECO Codes - Codes des ouvertures](https://www.365chess.com/eco.php)

---

## 📝 Notes et Décisions

| Date | Décision | Contexte |
|------|----------|----------|
| 2026-02-15 | Choix de l'accès publique sans compte | Permet de tester le produit avant engagement, favorise la découverte |
| 2026-02-15 | Distinction public/privé pour ouvertures | Équilibre entre partage communautaire et apprentissage personnel |
| 2026-02-15 | Utilisation de react-chessboard | Composant mature et bien maintenu, évite de réinventer la roue |
| 2026-02-15 | Stockage des coups en notation algébrique | Format standard, facilite l'interopérabilité et la lecture |

---

## ✅ Checklist d'initialisation

Avant de commencer le développement, vérifier que :

- [x] La vision du projet est claire
- [x] Les personas sont définis
- [x] Le périmètre MVP est validé
- [x] Les features principales sont listées
- [x] Les contraintes sont identifiées
- [ ] Les specs des features MVP sont rédigées dans `docs/features/`
- [ ] L'architecture technique est documentée
- [ ] Les maquettes de base sont créées

