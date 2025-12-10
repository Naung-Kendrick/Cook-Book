export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number; // in minutes
  imageUrl?: string;
  createdAt: number;
}

export interface RecipeFormData {
  name: string;
  ingredients: string; // Text area input, split by newlines
  steps: string; // Text area input, split by newlines
  cookingTime: number;
  imageUrl?: string;
}
