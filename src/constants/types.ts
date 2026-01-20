// User 등 공통 인터페이스

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
