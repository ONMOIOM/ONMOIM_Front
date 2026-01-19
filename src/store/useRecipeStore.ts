// Zustand 전역 상태 - 찜한 레시피 목록 (공유 데이터)
import { create } from 'zustand';

interface Recipe {
  id: number;
  title: string;
  thumbnail?: string;
  cookTime?: number;
  difficulty?: string;
}

interface RecipeStore {
  favoriteRecipes: Recipe[];
  setFavoriteRecipes: (recipes: Recipe[]) => void;
  addFavoriteRecipe: (recipe: Recipe) => void;
  removeFavoriteRecipe: (recipeId: number) => void;
}

const useRecipeStore = create<RecipeStore>((set) => ({
  favoriteRecipes: [],

  setFavoriteRecipes: (recipes) => set({ favoriteRecipes: recipes }),

  addFavoriteRecipe: (recipe) =>
    set((state) => ({
      favoriteRecipes: [...state.favoriteRecipes, recipe],
    })),

  removeFavoriteRecipe: (recipeId) =>
    set((state) => ({
      favoriteRecipes: state.favoriteRecipes.filter(
        (recipe) => recipe.id !== recipeId
      ),
    })),
}));

export { useRecipeStore };
