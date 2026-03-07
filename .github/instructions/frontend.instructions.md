---
applyTo: "frontend/**"
---

# Conventions Frontend — React 19 / TypeScript 5.x / Vite 6.x

## Composants

- **Functional components** uniquement
- **Export nommé** (jamais `export default`)
- Props typées avec interface suffixée `Props`
- Nom du fichier = nom du composant (PascalCase)

```tsx
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => onAddToCart?.(product)}>Ajouter</button>
    </div>
  );
};
```

## Hooks personnalisés

- Préfixe `use`
- Retour objet typé avec `loading`, `error`, `data`
- Gérer les 3 états : chargement, erreur, succès

```tsx
interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useProducts = (): UseProductsResult => { /* ... */ };
```

## Services API

- Objet avec méthodes async, types retour explicites
- URL base depuis `import.meta.env.VITE_API_URL`
- Gestion erreurs dans chaque méthode
- Header auth : `Authorization: Bearer {token}`

```tsx
const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
  async findAll(params?: PaginationParams): Promise<Page<Product>> { /* ... */ },
  async create(product: ProductRequest): Promise<Product> { /* ... */ },
};
```

## Types

- Interfaces pour les modèles de données
- Types utilitaires dans `types/common.ts` (`Page<T>`, `PaginationParams`, etc.)
- Un fichier par domaine dans `types/` (`auth.ts`, `product.ts`, etc.)

## Authentification

- Context React + hook `useAuth`
- JWT stocké et envoyé en header `Authorization: Bearer {token}`
- `ProtectedRoute` pour les routes authentifiées

## State management

- **Zustand** pour état global si nécessaire (préféré à Redux)
- State local avec `useState`/`useReducer` quand possible

## Structure des dossiers

```
pages/       → Composants de page (routes)
components/  → Composants réutilisables
hooks/       → Logique réutilisable
services/    → Appels API
store/       → État global Zustand
types/       → Définitions TypeScript
```

## Référence complète

Exemples de code détaillés : `docs/conventions/frontend.md`
Skills templates : `.github/skills/frontend-*/SKILL.md`

