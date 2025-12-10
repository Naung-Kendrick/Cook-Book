import { Recipe } from '../types';

// In a real production app, this would import Firebase/Firestore SDKs.
// For this standalone demo to run immediately on any machine, we use LocalStorage.

const STORAGE_KEY = 'culina_recipes';

export const getRecipes = async (): Promise<Recipe[]> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<Recipe> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const recipes = await getRecipes();
  const newRecipe: Recipe = {
    ...recipe,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  recipes.unshift(newRecipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  return newRecipe;
};

export const updateRecipe = async (updatedRecipe: Recipe): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const recipes = await getRecipes();
  const index = recipes.findIndex(r => r.id === updatedRecipe.id);
  if (index !== -1) {
    recipes[index] = updatedRecipe;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const recipes = await getRecipes();
  const filtered = recipes.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};