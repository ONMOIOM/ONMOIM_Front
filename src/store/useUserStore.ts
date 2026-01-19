// Zustand 전역 상태 - 로그인 유저 정보 및 식습관 설정
import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface DietaryPreferences {
  vegetarian?: boolean;
  vegan?: boolean;
  allergies?: string[];
  dislikedIngredients?: string[];
}

interface UserStore {
  user: User | null;
  dietaryPreferences: DietaryPreferences | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setDietaryPreferences: (preferences: DietaryPreferences | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  dietaryPreferences: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  setDietaryPreferences: (preferences) =>
    set({ dietaryPreferences: preferences }),
}));

export { useUserStore };
