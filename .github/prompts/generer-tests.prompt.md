---
name: generer-tests
description: Générer des tests ciblés pour du code existant
argument-hint: "type=<unit|integration|all> target=<service|controller|repository|component|hook>"
agent: test-writer
---

# 🧪 Génération de tests

## 📚 Contexte

- [Conventions backend](../../docs/conventions/backend.md)
- [Conventions frontend](../../docs/conventions/frontend.md)
- [Règles agents](../../AGENTS.md)

## 🔧 Tâche

- **Type** : ${input:type:unit, integration, ou all}
- **Cible** : ${input:target:service, controller, repository, component, hook}
- **Source à tester** :
  1. utiliser `${selection}` si du code est sélectionné ;
  2. sinon utiliser explicitement **le fichier actif dans l'éditeur**.

Ne pas demander `file=<chemin>` par défaut.

## ✅ Checklist opérationnelle

### 1) Analyse
- [ ] Identifier comportement attendu + cas d'erreur
- [ ] Déterminer framework de test adapté (JUnit/Mockito/MockMvc/Testcontainers ou Vitest/Testing Library/MSW)

### 2) Génération
- [ ] Créer/compléter le fichier de test correspondant
- [ ] Couvrir cas nominaux, validation, erreurs, régressions clés
- [ ] Utiliser des noms de tests explicites (`should...when...`)

### 3) Vérification
- [ ] Exécuter les tests du module touché
- [ ] Signaler ce qui reste hors couverture

## 📤 Résultat attendu

1. Fichiers de tests créés/modifiés
2. Cas couverts (nominal + erreur)
3. Lacunes restantes et recommandations

## 💡 Exemples d'invocation

```text
/generer-tests type=unit target=service
/generer-tests type=integration target=controller
/generer-tests type=all target=component
```

## 🗒️ Fallback secondaire

```text
Génère des tests pour la sélection courante (ou le fichier actif) avec type=all et target=service.
```
