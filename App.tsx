
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, ChefHat, Utensils, Coffee, BookOpen, Library, PenTool, Refrigerator } from 'lucide-react';
import { Recipe, RecipeFormData, RecipeCategory } from './types';
import * as storageService from './services/storageService';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeBooksView } from './components/RecipeBooksView';
import { NotebookView } from './components/NotebookView';
import { PantryView } from './components/PantryView';

const CATEGORY_FILTERS: { label: string; value: RecipeCategory | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Myanmar', value: 'Myanmar Traditional Food' },
  { label: 'Thai', value: 'Thai Traditional Food' },
  { label: 'Ta\'ang (Palaung)', value: 'Ta\'ang (Palaung) Traditional Food' },
  { label: 'Grilled', value: 'Grilled Food' },
  { label: 'Soups', value: 'Soups' },
  { label: 'Drinks', value: 'Drinks' },
  { label: 'Other', value: 'Other' },
];

type ViewState = 'collection' | 'notebook' | 'library' | 'pantry';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('collection');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<RecipeCategory | 'All'>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<Recipe | null>(null);
  const [initialAiPrompt, setInitialAiPrompt] = useState('');

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
    const ingredients = data.ingredients.split('\n').filter(line => line.trim() !== '');
    const steps = data.steps.split('\n').filter(line => line.trim() !== '');
    
    const recipePayload = {
      name: data.name,
      ingredients,
      steps,
      cookingTime: data.cookingTime,
      imageUrl: data.imageUrl,
      category: data.category
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
    setInitialAiPrompt('');
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecipe(null);
    setInitialAiPrompt('');
    setIsModalOpen(true);
  };

  const handlePantrySuggestion = (dishName: string) => {
    setEditingRecipe(null);
    setInitialAiPrompt(dishName);
    setIsModalOpen(true);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTime = timeFilter ? recipe.cookingTime < timeFilter : true;
      const matchesCategory = categoryFilter === 'All' ? true : recipe.category === categoryFilter;
      return matchesSearch && matchesTime && matchesCategory;
    });
  }, [recipes, searchQuery, timeFilter, categoryFilter]);

  return (
    <div className="min-h-screen pb-20">
      {/* Rustic Header */}
      <header className="relative z-40 w-full pt-8 pb-0 px-6 bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-700 text-amber-50 shadow-md">
                <ChefHat size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-stone-800">Culina</h1>
                <p className="text-sm font-medium text-stone-500 italic">Wholesome recipes for the soul</p>
              </div>
            </div>

            <nav className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl overflow-x-auto max-w-full">
              <button
                onClick={() => setCurrentView('collection')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  currentView === 'collection' 
                    ? 'bg-white text-orange-800 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Utensils size={16} /> Collection
              </button>
              <button
                onClick={() => setCurrentView('pantry')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  currentView === 'pantry' 
                    ? 'bg-white text-orange-800 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Refrigerator size={16} /> Pantry
              </button>
              <button
                onClick={() => setCurrentView('notebook')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  currentView === 'notebook' 
                    ? 'bg-white text-orange-800 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <PenTool size={16} /> Notebook
              </button>
              <button
                onClick={() => setCurrentView('library')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                  currentView === 'library' 
                    ? 'bg-white text-orange-800 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Library size={16} /> Library
              </button>
            </nav>

            {currentView === 'collection' ? (
              <button
                onClick={openCreateModal}
                className="hidden md:flex group items-center gap-2 rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-900/10 transition-all hover:bg-orange-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                <Plus size={18} />
                <span>Create Recipe</span>
              </button>
            ) : <div className="hidden md:block w-[140px]"></div>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW: COLLECTION */}
        {currentView === 'collection' && (
          <div className="animate-in fade-in duration-500">
            {/* Search & Filters */}
            <div className="mb-8 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Search size={20} className="text-stone-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search your collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-xl border-2 border-stone-200 bg-white py-3 pl-11 pr-4 text-stone-700 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 shadow-sm transition-all"
                  />
                </div>
                
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  <div className="flex items-center gap-2 text-sm font-bold text-stone-500 mr-2 whitespace-nowrap uppercase tracking-wider text-xs">
                    <Filter size={14} /> Time
                  </div>
                  {[
                    { label: 'Any', value: null },
                    { label: '< 30m', value: 30 },
                    { label: '< 60m', value: 60 },
                  ].map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setTimeFilter(option.value)}
                      className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium border-2 transition-all ${
                        timeFilter === option.value
                          ? 'bg-stone-800 border-stone-800 text-stone-50'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-hide">
                   {CATEGORY_FILTERS.map((cat) => (
                      <button
                        key={cat.label}
                        onClick={() => setCategoryFilter(cat.value)}
                        className={`whitespace-nowrap rounded-2xl px-5 py-2.5 text-sm font-serif font-medium transition-all shadow-sm ${
                          categoryFilter === cat.value
                            ? 'bg-amber-100 text-amber-900 border-2 border-amber-200'
                            : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                   ))}
                </div>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-orange-700" />
                  <p className="font-serif text-lg text-stone-500 italic">Preparing kitchen...</p>
                </div>
              </div>
            ) : filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={openEditModal}
                    onDelete={handleDeleteRecipe}
                    onClick={setViewingRecipe}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 bg-stone-50/50 text-center p-8">
                <div className="mb-6 rounded-full bg-orange-100 p-6 text-orange-700">
                  <Coffee size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">No recipes found</h3>
                <p className="text-stone-500 max-w-md mx-auto">
                  The kitchen is quiet. Start cooking by adding a new recipe or try generating one with our chef AI.
                </p>
                {(!searchQuery && !timeFilter && categoryFilter === 'All') && (
                  <button
                    onClick={openCreateModal}
                    className="mt-8 font-serif italic text-lg text-orange-700 hover:text-orange-800 underline underline-offset-4"
                  >
                    Create your first masterpiece
                  </button>
                )}
              </div>
            )}
            
            {/* Mobile Fab for Collection View */}
            <button
               onClick={openCreateModal}
               className="md:hidden fixed bottom-6 right-6 h-14 w-14 flex items-center justify-center rounded-full bg-orange-700 text-white shadow-lg shadow-orange-900/30 active:scale-95 transition-transform z-50"
             >
               <Plus size={24} />
             </button>
          </div>
        )}

        {/* VIEW: PANTRY */}
        {currentView === 'pantry' && (
          <PantryView onSelectSuggestion={handlePantrySuggestion} />
        )}

        {/* VIEW: NOTEBOOK */}
        {currentView === 'notebook' && <NotebookView />}

        {/* VIEW: LIBRARY */}
        {currentView === 'library' && <RecipeBooksView />}

      </main>

      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecipe}
        initialData={editingRecipe}
        initialAiPrompt={initialAiPrompt}
      />
      
      <RecipeDetailModal 
        isOpen={!!viewingRecipe}
        onClose={() => setViewingRecipe(null)}
        recipe={viewingRecipe}
      />
    </div>
  );
}
