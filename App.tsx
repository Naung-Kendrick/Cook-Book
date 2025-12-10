import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, ChefHat, Flame } from 'lucide-react';
import { Recipe, RecipeFormData } from './types';
import * as storageService from './services/storageService';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<number | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      const data = await storageService.getRecipes();
      setRecipes(data);
    } catch (err) {
      console.error("Failed to load recipes", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async (data: RecipeFormData) => {
    // Process text areas into arrays
    const ingredients = data.ingredients.split('\n').filter(line => line.trim() !== '');
    const steps = data.steps.split('\n').filter(line => line.trim() !== '');
    
    const recipePayload = {
      name: data.name,
      ingredients,
      steps,
      cookingTime: data.cookingTime,
      imageUrl: data.imageUrl
    };

    if (editingRecipe) {
      await storageService.updateRecipe({
        ...editingRecipe,
        ...recipePayload
      });
    } else {
      await storageService.saveRecipe(recipePayload);
    }
    
    await loadRecipes();
  };

  const handleDeleteRecipe = async (id: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      await storageService.deleteRecipe(id);
      await loadRecipes();
    }
  };

  const openEditModal = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecipe(null);
    setIsModalOpen(true);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTime = timeFilter ? recipe.cookingTime < timeFilter : true;
      return matchesSearch && matchesTime;
    });
  }, [recipes, searchQuery, timeFilter]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-200">
              <ChefHat size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Culina</h1>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all active:scale-95"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Recipe</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mr-2">
              <Filter size={16} /> Filters:
            </div>
            {[
              { label: 'All', value: null },
              { label: 'Quick (< 30m)', value: 30 },
              { label: 'Medium (< 60m)', value: 60 },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => setTimeFilter(option.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  timeFilter === option.value
                    ? 'bg-orange-100 text-orange-700 ring-1 ring-orange-200'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
              <p className="text-sm font-medium text-slate-500">Loading your cookbook...</p>
            </div>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={openEditModal}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 text-center">
            <div className="mb-4 rounded-full bg-orange-50 p-4 text-orange-500">
              <Flame size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No recipes found</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              {searchQuery || timeFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Your cookbook is empty. Create a new recipe or use AI to generate one!"}
            </p>
            {(!searchQuery && !timeFilter) && (
              <button
                onClick={openCreateModal}
                className="mt-6 font-medium text-orange-600 hover:text-orange-700"
              >
                Add your first recipe &rarr;
              </button>
            )}
          </div>
        )}
      </main>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecipe}
        initialData={editingRecipe}
      />
    </div>
  );
}
