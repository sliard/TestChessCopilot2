# Conventions Frontend (React/TypeScript)

## Composants

```tsx
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  const handleClick = () => {
    onAddToCart?.(product);
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p className="price">{formatPrice(product.price)}</p>
      <button onClick={handleClick}>Ajouter au panier</button>
    </div>
  );
};
```

**Règles :**
- Functional components uniquement
- Props typées avec interface (suffixe `Props`)
- Export nommé (pas de default export)
- Nom du fichier = nom du composant

## Hooks personnalisés

```tsx
interface UseProductsOptions {
  page?: number;
  size?: number;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.findAll(options);
      setProducts(data.content);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [options.page, options.size]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};
```

**Règles :**
- Préfixer avec `use`
- Retourner un objet typé
- Gérer loading, error, data

## Services API

```tsx
const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
  async findAll(params?: PaginationParams): Promise<Page<Product>> {
    const response = await fetch(`${API_URL}/products?${new URLSearchParams(params)}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async create(product: ProductRequest): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },
};
```

## Types

```tsx
// types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: string;
}

export interface ProductRequest {
  name: string;
  price: number;
}

// types/common.ts
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
```

## Authentification

```tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

