
export type RecipeCategory = 
  | 'Drinks' 
  | 'Soups' 
  | 'Grilled Food' 
  | 'Myanmar Traditional Food' 
  | 'Thai Traditional Food' 
  | 'Ta\'ang (Palaung) Traditional Food'
  | 'Other';

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number; // in minutes
  imageUrl?: string;
  category: RecipeCategory;
  createdAt: number;
}

export interface RecipeFormData {
  name: string;
  ingredients: string; // Text area input, split by newlines
  steps: string; // Text area input, split by newlines
  cookingTime: number;
  imageUrl?: string;
  category: RecipeCategory;
}

export interface NotebookEntry {
  id: string;
  title: string;
  source: string; // "Grandma", "Friend", etc.
  content: string; // Free text
  createdAt: number;
}

export interface RecipeSuggestion {
  name: string;
  description: string;
  usedIngredients: string[];
  missingIngredients: string[];
}
