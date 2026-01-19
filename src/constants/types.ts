// Recipe, User 등 공통 인터페이스

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  cookingTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: string;
  ingredients?: string[];
  steps?: string[];
}

export interface User {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
}

export interface DietaryPreferences {
  vegetarian?: boolean;
  vegan?: boolean;
  allergies?: string[];
  dislikedIngredients?: string[];
}
