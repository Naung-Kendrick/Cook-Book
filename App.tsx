
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, ChefHat, Menu, X, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';
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
  { label: 'Ta\'ang', value: 'Ta\'ang (Palaung) Traditional Food' },
  { label: 'Grilled', value: 'Grilled Food' },
  { label: 'Soups', value: 'Soups' },
  { label: 'Drinks', value: 'Drinks' },
  { label: 'Other', value: 'Other' },
];

type ViewState = 'collection' | 'notebook' | 'library' | 'pantry';

const NAV_ITEMS = [
  { id: 'collection', label: 'Recipes' },
  { id: 'pantry', label: 'Pantry Chef' },
  { id: 'notebook', label: 'Notebook' },
  { id: 'library', label: 'Books' },
] as const;

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('collection');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search state is now global
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Filter state for collection
  const [timeFilter, setTimeFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<RecipeCategory | 'All'>('All');
  
  // Modals
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

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query);
    if (query && currentView !== 'collection') {
      setCurrentView('collection');
    }
  };

  const handleNavClick = (view: ViewState) => {
    setCurrentView(view);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* --- SIDE DRAWER (Mobile) --- */}
      <div 
        className={`fixed inset-0 z-50 transform transition-all duration-300 ease-in-out ${isDrawerOpen ? 'visible' : 'invisible'}`}
      >
        <div 
          className={`absolute inset-0 bg-stone-900/50 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsDrawerOpen(false)}
        />
        <div 
          className={`absolute left-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6 flex items-center justify-between border-b border-stone-100">
             <span className="font-serif text-2xl font-bold tracking-tight">Culina</span>
             <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-stone-500 hover:bg-stone-100 rounded-full">
               <X size={24} />
             </button>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find a recipe..." 
                value={searchQuery}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-4 pr-10 text-stone-700 focus:outline-none focus:border-orange-500"
              />
              <Search className="absolute right-3 top-3.5 text-stone-400" size={18} />
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-4">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`flex items-center justify-between text-left font-bold text-lg py-2 border-b border-stone-100 ${
                    currentView === item.id ? 'text-orange-700' : 'text-stone-600'
                  }`}
                >
                  {item.label}
                  <ArrowRight size={16} className={`transform transition-transform ${currentView === item.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                </button>
              ))}
            </nav>

            <button
              onClick={() => { openCreateModal(); setIsDrawerOpen(false); }}
              className="w-full bg-orange-700 text-white font-bold text-sm py-3 rounded-lg shadow-md mt-4"
            >
              Submit Recipe
            </button>
          </div>

          {/* Social Icons Footer */}
          <div className="p-6 border-t border-stone-100 bg-stone-50">
            <div className="flex justify-center gap-6 text-stone-400">
              <Facebook size={20} className="hover:text-stone-800 cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-stone-800 cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-stone-800 cursor-pointer transition-colors" />
              <Youtube size={20} className="hover:text-stone-800 cursor-pointer transition-colors" />
            </div>
            <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-wider">
              © 2024 Culina Inc.
            </p>
          </div>
        </div>
      </div>

      {/* --- DESKTOP HEADER --- */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-stone-200 shadow-sm transition-all">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-4 lg:gap-8">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="lg:hidden p-2 -ml-2 text-stone-700 hover:bg-stone-100 rounded-md"
              >
                <Menu size={24} strokeWidth={2} />
              </button>
              
              <div 
                className="flex items-center gap-2 cursor-pointer group" 
                onClick={() => setCurrentView('collection')}
              >
                <ChefHat className="text-orange-700 group-hover:rotate-12 transition-transform duration-300" size={28} strokeWidth={2} />
                <h1 className="text-2xl lg:text-3xl font-serif font-bold tracking-tight text-stone-800">
                  Culina<span className="text-orange-700">.</span>
                </h1>
              </div>
            </div>

            {/* Center/Right: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`text-sm font-bold transition-all hover:text-orange-700 relative py-2 group ${
                    currentView === item.id ? 'text-orange-700' : 'text-stone-500'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-700 transform origin-left transition-transform duration-300 ${currentView === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </button>
              ))}
              <div className="h-6 w-px bg-stone-200 mx-2"></div>
              <button onClick={openCreateModal} className="text-sm font-bold text-stone-500 hover:text-orange-700">
                Create
              </button>
            </nav>

            {/* Right: Search */}
            <div className="hidden lg:flex items-center">
               <div className="relative group">
                 <input
                    type="text"
                    placeholder="Find a recipe"
                    value={searchQuery}
                    onChange={(e) => handleGlobalSearch(e.target.value)}
                    className="w-[240px] transition-all duration-300 border border-stone-300 bg-stone-50 px-4 py-2 pr-10 text-sm focus:border-orange-500 focus:outline-none focus:w-[300px]"
                 />
                 <Search className="absolute right-3 top-2.5 text-stone-400 pointer-events-none group-focus-within:text-orange-600" size={16} />
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-[calc(100vh-80px)]">
        
        {/* VIEW: COLLECTION */}
        {currentView === 'collection' && (
          <div className="animate-in fade-in duration-500 space-y-8">
            
            {/* Collection Sub-Header / Filters */}
            <div className="flex flex-col gap-6 border-b border-stone-200 pb-8">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-800">Latest Recipes</h2>
                    <p className="text-stone-500 mt-1 italic font-serif">Fresh from the kitchen to your table.</p>
                  </div>
                  
                  {/* Time Filter */}
                  <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1 rounded-full border border-stone-200 shadow-sm">
                    <span className="pl-3 text-xs font-bold uppercase text-stone-400 tracking-wider flex items-center gap-1">
                      <Filter size={12} /> Time
                    </span>
                    {[
                      { label: 'Any', value: null },
                      { label: '< 30m', value: 30 },
                      { label: '< 60m', value: 60 },
                    ].map((option) => (
                      <button
                        key={option.label}
                        onClick={() => setTimeFilter(option.value)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                          timeFilter === option.value
                            ? 'bg-stone-800 text-white'
                            : 'text-stone-500 hover:bg-stone-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Category Tabs */}
               <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                 <div className="flex gap-2">
                    {CATEGORY_FILTERS.map((cat) => (
                       <button
                         key={cat.label}
                         onClick={() => setCategoryFilter(cat.value)}
                         className={`whitespace-nowrap px-4 py-2 border-b-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                           categoryFilter === cat.value
                             ? 'border-orange-700 text-orange-800 bg-orange-50/50'
                             : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-200'
                         }`}
                       >
                         {cat.label}
                       </button>
                    ))}
                 </div>
               </div>
            </div>

            {/* Recipes Grid */}
            {isLoading ? (
              <div className="py-20 text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-orange-700 mb-4" />
                <p className="font-serif text-stone-500 italic">Gathering ingredients...</p>
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
              <div className="py-24 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                <ChefHat size={48} className="mx-auto text-stone-300 mb-4" />
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">No recipes found</h3>
                <p className="text-stone-500 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 text-orange-700 font-bold text-sm hover:underline"
                >
                  <Plus size={16} /> Add New Recipe
                </button>
              </div>
            )}
          </div>
        )}

        {/* OTHER VIEWS */}
        {currentView === 'pantry' && <PantryView onSelectSuggestion={handlePantrySuggestion} />}
        {currentView === 'notebook' && <NotebookView />}
        {currentView === 'library' && <RecipeBooksView />}

      </main>

      {/* Floating Action Button (Mobile Only) */}
      {currentView === 'collection' && (
        <button
          onClick={openCreateModal}
          className="lg:hidden fixed bottom-6 right-6 h-14 w-14 flex items-center justify-center rounded-full bg-orange-700 text-white shadow-xl shadow-orange-900/30 z-30 active:scale-95 transition-transform"
        >
          <Plus size={28} />
        </button>
      )}

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
