// TODO: Feature 002 — Replace with real auth context
interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface UseAuthResult {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
}

export const useAuth = (): UseAuthResult => {
  return {
    isAuthenticated: false,
    user: null,
    logout: () => {},
  };
};
