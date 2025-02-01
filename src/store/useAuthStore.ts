import { create } from "zustand";

interface User {
  email: string;
  name: string;
  picture?: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("token"); // JWT 토큰 제거
    set({ user: null });
  },
}));
