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
import { IntroAnimation } from './components/IntroAnimation';

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
  const [showIntro, setShowIntro] = useState(true);
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
    // Removed bg-white to let the food pattern body background show through
    <div className="min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}

      {/* --- SIDE DRAWER (Mobile & Desktop Trigger) --- */}
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
             <span className="font-serif text-2xl font-bold tracking-tight text-orange-600">Culina</span>
             <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-stone-500 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors">
               <X size={24} />
             </button>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Mobile Search */}
            <div className="relative lg:hidden">
              <input 
                type="text" 
                placeholder="Find a recipe..." 
                value={searchQuery}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-4 pr-10 text-stone-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              <Search className="absolute right-3 top-3.5 text-stone-400" size={18} />
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-4">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewState)}
                  className={`flex items-center justify-between text-left font-bold text-lg py-2 border-b border-stone-100 hover:text-orange-600 ${
                    currentView === item.id ? 'text-orange-600' : 'text-stone-500'
                  }`}
                >
                  {item.label}
                  <ArrowRight size={16} className={`transform transition-transform ${currentView === item.id ? 'translate-x-0 opacity-100 text-orange-500' : '-translate-x-2 opacity-0'}`} />
                </button>
              ))}
            </nav>

            <button
              onClick={() => { openCreateModal(); setIsDrawerOpen(false); }}
              className="w-full bg-orange-500 text-white font-bold text-sm py-3 rounded-lg shadow-md mt-4 hover:bg-orange-600 transition-colors"
            >
              Submit Recipe
            </button>
          </div>

          {/* Social Icons Footer */}
          <div className="p-6 border-t border-stone-100 bg-orange-50">
            <div className="flex justify-center gap-6 text-orange-400">
              <Facebook size={20} className="hover:text-orange-600 cursor-pointer transition-colors" />
              <Instagram size={20} className="hover:text-orange-600 cursor-pointer transition-colors" />
              <Twitter size={20} className="hover:text-orange-600 cursor-pointer transition-colors" />
              <Youtube size={20} className="hover:text-orange-600 cursor-pointer transition-colors" />
            </div>
            <p className="text-center text-[10px] text-stone-400 mt-4 uppercase tracking-wider">
              © 2024 Culina Inc.
            </p>
          </div>
        </div>
      </div>

      {/* --- DESKTOP HEADER --- */}
      <header className="sticky top-0 z-40 w-full bg-white border-b-4 border-orange-100 shadow-md transition-all">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            
            {/* Left Section: Hamburger & Logo */}
            <div className="flex items-center gap-5">
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 -ml-2 text-stone-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors"
              >
                <Menu size={24} strokeWidth={2} />
              </button>
              
              <div 
                className="flex items-center gap-2 cursor-pointer select-none group" 
                onClick={() => setCurrentView('collection')}
              >
                <div className="bg-orange-50 p-2 rounded-full group-hover:bg-orange-100 transition-colors">
                  <ChefHat className="text-orange-600 group-hover:rotate-12 transition-transform duration-300" size={24} strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-serif font-bold tracking-tight text-stone-900 group-hover:text-orange-600 transition-colors">
                  Culina<span className="text-orange-500">.</span>
                </h1>
              </div>
            </div>

            {/* Right Section: Nav & Search */}
            <div className="hidden lg:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ViewState)}
                    className={`text-sm font-bold transition-colors hover:text-orange-600 relative py-1 ${
                      currentView === item.id ? 'text-orange-600' : 'text-stone-500'
                    }`}
                  >
                    {item.label}
                    {currentView === item.id && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 rounded-full"></span>
                    )}
                  </button>
                ))}
                
                {/* Separator */}
                <div className="h-4 w-px bg-stone-300"></div>
                
                <button 
                  onClick={openCreateModal} 
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full hover:bg-orange-600 transition-all shadow-md hover:shadow-lg shadow-orange-200"
                >
                  Create Recipe
                </button>
              </nav>

              {/* Search Bar */}
              <div className="relative group">
                 <input
                    type="text"
                    placeholder="Find a recipe"
                    value={searchQuery}
                    onChange={(e) => handleGlobalSearch(e.target.value)}
                    className="w-[240px] transition-all duration-300 border border-stone-200 bg-stone-50 px-4 py-2 pr-10 text-sm rounded-full focus:border-orange-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-100"
                 />
                 <Search className="absolute right-3 top-2.5 text-stone-400 pointer-events-none group-focus-within:text-orange-500" size={16} />
              </div>
            </div>

            {/* Mobile Right: Just spacing or actions if needed later */}
            <div className="lg:hidden"></div>

          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-8 lg:py-12 min-h-[calc(100vh-80px)]">
        
        {/* VIEW: COLLECTION */}
        {currentView === 'collection' && (
          <div className="animate-in fade-in duration-500 space-y-8">
            
            {/* Collection Sub-Header / Filters - Solid White for contrast against pattern */}
            <div className="flex flex-col gap-6 bg-white p-8 rounded-3xl shadow-xl shadow-orange-900/10 border-4 border-white/50">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-serif font-bold text-stone-900">Latest Recipes</h2>
                    <p className="text-stone-500 mt-2 italic font-serif text-lg">Fresh from the kitchen to your table.</p>
                  </div>
                  
                  {/* Time Filter */}
                  <div className="flex items-center gap-2 self-start md:self-auto bg-stone-50 p-1.5 rounded-full border border-stone-200">
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
                        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                          timeFilter === option.value
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                            : 'text-stone-500 hover:bg-white hover:text-orange-600'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Category Tabs */}
               <div className="overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide pt-2">
                 <div className="flex gap-4">
                    {CATEGORY_FILTERS.map((cat) => (
                       <button
                         key={cat.label}
                         onClick={() => setCategoryFilter(cat.value)}
                         className={`whitespace-nowrap px-2 py-2 border-b-4 text-sm font-bold uppercase tracking-widest transition-all ${
                           categoryFilter === cat.value
                             ? 'border-orange-500 text-orange-600'
                             : 'border-transparent text-stone-400 hover:text-orange-500 hover:border-orange-200'
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
              <div className="py-20 text-center bg-white rounded-3xl shadow-lg">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-stone-200 border-t-orange-500 mb-4" />
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
              <div className="py-24 text-center border-2 border-dashed border-stone-200 rounded-3xl bg-white shadow-lg">
                <ChefHat size={48} className="mx-auto text-stone-300 mb-4" />
                <h3 className="text-xl font-serif font-bold text-stone-800 mb-2">No recipes found</h3>
                <p className="text-stone-500 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline"
                >
                  <Plus size={16} /> Add New Recipe
                </button>
              </div>
            )}
          </div>
        )}

        {/* OTHER VIEWS - Wrapped in solid white containers for readability */}
        {currentView === 'pantry' && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-white/50">
            <PantryView onSelectSuggestion={handlePantrySuggestion} />
          </div>
        )}
        {currentView === 'notebook' && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-white/50">
            <NotebookView />
          </div>
        )}
        {currentView === 'library' && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-white/50">
            <RecipeBooksView />
          </div>
        )}

      </main>

      {/* Floating Action Button (Mobile Only) */}
      {currentView === 'collection' && (
        <button
          onClick={openCreateModal}
          className="lg:hidden fixed bottom-6 right-6 h-14 w-14 flex items-center justify-center rounded-full bg-orange-500 text-white shadow-xl shadow-orange-500/30 z-30 active:scale-95 transition-transform"
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