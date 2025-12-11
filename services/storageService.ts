import { Recipe, NotebookEntry } from '../types';

// In a real production app, this would import Firebase/Firestore SDKs.
// For this standalone demo to run immediately on any machine, we use LocalStorage.

// Changed key to v3 to ensure Ta'ang recipes load for the user
const STORAGE_KEY = 'culina_recipes_v3';
const NOTEBOOK_KEY = 'culina_notebook_v1';

const SEED_DATA: Recipe[] = [
  {
    id: 'seed-taang-1',
    name: 'Ta\'ang Pickled Tea Leaf Salad',
    ingredients: [
      '200g Fermented Tea Leaves (Lahpet)',
      '1 cup Fried Mixed Beans (butter beans, chickpeas)',
      '1/4 cup Toasted Sesame Seeds',
      '3 cloves Garlic, sliced and fried',
      '2 Tomatoes, sliced',
      '1 tbsp Fish Sauce',
      '2 tbsp Peanut Oil',
      'Fresh Green Chili (to taste)'
    ],
    steps: [
      'In a mixing bowl, mash the fermented tea leaves with peanut oil and lime juice.',
      'Add the tomatoes, cabbage (if using), and fish sauce. Mix well by hand.',
      'Add the crunchy fried beans, garlic, and sesame seeds last to keep them crisp.',
      'Taste and adjust salt or chili.',
      'Serve with plain rice or as a snack with green tea.'
    ],
    cookingTime: 15,
    category: 'Ta\'ang (Palaung) Traditional Food',
    imageUrl: 'https://images.unsplash.com/photo-1626804475297-411dbe65d648?q=80&w=800&auto=format&fit=crop', // Tea leaf salad aesthetic
    createdAt: Date.now()
  },
  {
    id: 'seed-taang-2',
    name: 'Sour Bamboo Shoot Chicken Curry',
    ingredients: [
      '500g Chicken, cut into chunks',
      '300g Pickled Sour Bamboo Shoots',
      '1 tbsp Ginger, pounded',
      '1 tbsp Garlic, pounded',
      '2 tbsp Chili Powder',
      '1 stalk Lemongrass',
      '1/2 tsp Turmeric',
      'Fresh Basil or Sawtooth Coriander'
    ],
    steps: [
      'Marinate chicken with turmeric and salt.',
      'Heat oil and sauté ginger, garlic, and chili powder until fragrant.',
      'Add the chicken and stir-fry until the meat changes color.',
      'Add the sour bamboo shoots and a splash of water.',
      'Simmer for 20-30 minutes until chicken is tender.',
      'Garnish with fresh herbs before serving.'
    ],
    cookingTime: 45,
    category: 'Ta\'ang (Palaung) Traditional Food',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop', // Rich curry aesthetic
    createdAt: Date.now() - 5000
  },
  {
    id: 'seed-1',
    name: 'Mohinga (Myanmar Fish Noodle Soup)',
    ingredients: [
      '1 kg Catfish',
      '500g Rice Vermicelli',
      '1 stalk Lemongrass',
      '2 tbsp Fish Sauce',
      '1 tsp Turmeric',
      '2 Boiled Eggs',
      'Banana Stem (optional)'
    ],
    steps: [
      'Boil the fish with lemongrass and turmeric until tender.',
      'Debone the fish and mash the flesh.',
      'In a pot, sauté onions, garlic, and ginger.',
      'Add the fish paste and broth. Simmer for 30 mins.',
      'Serve hot over rice vermicelli with boiled eggs and lime.'
    ],
    cookingTime: 60,
    category: 'Myanmar Traditional Food',
    // Authentic Mohinga image
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mohinga_served_with_fried_gourd.jpg/800px-Mohinga_served_with_fried_gourd.jpg',
    createdAt: Date.now() - 10000
  },
  {
    id: 'seed-2',
    name: 'Tom Yum Goong',
    ingredients: [
      '300g Shrimp',
      '2 cups Chicken Stock',
      '3 stalks Lemongrass',
      '3 Kaffir Lime Leaves',
      '2 tbsp Thai Chili Paste',
      '3 tbsp Lime Juice'
    ],
    steps: [
      'Bring chicken stock to a boil. Add lemongrass and galangal.',
      'Add shrimp and mushrooms. Cook until shrimp turns pink.',
      'Stir in chili paste and fish sauce.',
      'Turn off heat and add lime juice and chili peppers.',
      'Garnish with cilantro and serve.'
    ],
    cookingTime: 25,
    category: 'Thai Traditional Food',
    // Authentic Tom Yum image
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Tom_Yum_Goong.jpg/800px-Tom_Yum_Goong.jpg',
    createdAt: Date.now() - 20000
  },
  {
    id: 'seed-3',
    name: 'Grilled Honey Garlic Chicken',
    ingredients: [
      '4 Chicken Thighs',
      '1/4 cup Honey',
      '4 cloves Garlic, minced',
      '2 tbsp Soy Sauce',
      '1 tbsp Olive Oil'
    ],
    steps: [
      'Mix honey, garlic, soy sauce, and oil in a bowl.',
      'Marinate chicken for at least 30 minutes.',
      'Preheat grill to medium-high heat.',
      'Grill chicken for 6-8 minutes per side until fully cooked.',
      'Brush with remaining glaze before serving.'
    ],
    cookingTime: 40,
    category: 'Grilled Food',
    imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 30000
  },
  {
    id: 'seed-4',
    name: 'Classic Mojito',
    ingredients: [
      '10 Fresh Mint Leaves',
      '1/2 Lime, cut into wedges',
      '2 tbsp White Sugar',
      '1 cup Ice Cubes',
      '1.5 oz White Rum',
      '1/2 cup Club Soda'
    ],
    steps: [
      'Muddle mint leaves and lime wedges in a glass.',
      'Add sugar and muddle again to release lime juice.',
      'Fill glass with ice.',
      'Pour in rum and top with club soda.',
      'Stir gently and garnish with mint.'
    ],
    cookingTime: 5,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 40000
  },
  {
    id: 'seed-5',
    name: 'Roasted Tomato Basil Soup',
    ingredients: [
      '1 kg Roma tomatoes, halved',
      '1 onion, quartered',
      '4 cloves garlic',
      '1/2 cup fresh basil leaves',
      '2 cups vegetable broth',
      '1/2 cup heavy cream (optional)'
    ],
    steps: [
      'Roast tomatoes, onion, and garlic at 400°F (200°C) for 30 mins.',
      'Blend the roasted vegetables until smooth.',
      'Pour into a pot and add vegetable broth. Simmer for 10 mins.',
      'Stir in fresh basil and cream.',
      'Serve with crusty bread.'
    ],
    cookingTime: 45,
    category: 'Soups',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23acbe3b624b?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 50000
  },
  {
    id: 'seed-6',
    name: 'Fresh Greek Salad',
    ingredients: [
      '1 cucumber, diced',
      '2 tomatoes, diced',
      '1/2 red onion, sliced',
      '1/2 cup Kalamata olives',
      '200g Feta cheese',
      '2 tbsp Olive Oil',
      '1 tsp Oregano'
    ],
    steps: [
      'Combine cucumber, tomatoes, onion, and olives in a large bowl.',
      'Drizzle with olive oil and sprinkle oregano.',
      'Toss gently to coat.',
      'Top with a block of feta cheese or crumbled feta.',
      'Serve fresh.'
    ],
    cookingTime: 10,
    category: 'Other',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format&fit=crop',
    createdAt: Date.now() - 60000
  }
];

const NOTEBOOK_SEED_DATA: NotebookEntry[] = [
  {
    id: 'note-1',
    title: 'Auntie Daw Nu\'s Chili Paste',
    source: 'Auntie Daw Nu',
    content: 'She said the secret is to roast the garlic until it\'s almost black, not just brown. Then pound it with dry roasted chili flakes and a tiny bit of tamarind juice. Don\'t use vinegar!',
    createdAt: Date.now() - 100000
  },
  {
    id: 'note-2',
    title: 'Tips for Fluffy Rice',
    source: 'Cooking Show',
    content: 'Wash the rice 3 times until water is clear. Use the knuckle method for water level. Let it sit for 10 mins after cooking before opening the lid.',
    createdAt: Date.now() - 200000
  }
];

// --- RECIPE FUNCTIONS ---

export const getRecipes = async (): Promise<Recipe[]> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = localStorage.getItem(STORAGE_KEY);
  
  if (!data) {
    // Return seed data if empty so the user sees examples immediately
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }

  const recipes = JSON.parse(data);
  
  // Migration: Ensure all recipes have a category (for old data)
  return recipes.map((r: any) => ({
    ...r,
    category: r.category || 'Other'
  }));
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

// --- NOTEBOOK FUNCTIONS ---

export const getNotebookEntries = async (): Promise<NotebookEntry[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = localStorage.getItem(NOTEBOOK_KEY);
  if (!data) {
    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(NOTEBOOK_SEED_DATA));
    return NOTEBOOK_SEED_DATA;
  }
  return JSON.parse(data);
};

export const saveNotebookEntry = async (entry: Omit<NotebookEntry, 'id' | 'createdAt'>): Promise<NotebookEntry> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const entries = await getNotebookEntries();
  const newEntry: NotebookEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  entries.unshift(newEntry);
  localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(entries));
  return newEntry;
};

export const deleteNotebookEntry = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const entries = await getNotebookEntries();
  const filtered = entries.filter(e => e.id !== id);
  localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(filtered));
};