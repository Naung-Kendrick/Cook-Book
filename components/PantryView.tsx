
import React, { useState } from 'react';
import { Sparkles, ChefHat, Loader2, ArrowRight, AlertCircle, Refrigerator } from 'lucide-react';
import { suggestRecipesFromIngredients } from '../services/geminiService';
import { RecipeSuggestion } from '../types';

interface PantryViewProps {
  onSelectSuggestion: (dishName: string) => void;
}

export const PantryView: React.FC<PantryViewProps> = ({ onSelectSuggestion }) => {
  const [ingredients, setIngredients] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<RecipeSuggestion[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    setIsSearching(true);
    setError('');
    setSuggestions([]);

    try {
      const results = await suggestRecipesFromIngredients(ingredients);
      setSuggestions(results);
    } catch (err) {
      console.error(err);
      setError('Failed to get suggestions. Please check your API key and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shadow-md">
          <Refrigerator size={40} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-800">The Pantry Chef</h2>
          <p className="text-stone-500 max-w-lg mx-auto mt-2">
            Don't know what to cook? Tell us what ingredients you have, and we'll help you turn them into a meal.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden mb-12">
        <div className="bg-stone-50 p-4 border-b border-stone-100 flex items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-red-400"></span>
          <span className="flex h-3 w-3 rounded-full bg-yellow-400"></span>
          <span className="flex h-3 w-3 rounded-full bg-green-400"></span>
          <span className="ml-2 text-xs font-bold text-stone-400 uppercase tracking-widest">Ingredients List</span>
        </div>
        <form onSubmit={handleSearch} className="p-6 sm:p-8">
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. 2 eggs, some leftover rice, soy sauce, a bit of cabbage..."
            className="w-full h-32 p-4 text-lg bg-transparent border-2 border-dashed border-stone-300 rounded-xl focus:border-emerald-500 focus:ring-0 focus:outline-none transition-colors resize-none placeholder:text-stone-400 font-serif leading-relaxed"
          />
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSearching || !ingredients.trim()}
              className="flex items-center gap-2 bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 hover:bg-emerald-800 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? <Loader2 className="animate-spin" /> : <Sparkles />}
              {isSearching ? 'Chefs are thinking...' : 'Find Recipes'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-bold text-stone-800 pl-2 border-l-4 border-emerald-600">
            Suggested Dishes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="group bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  <h4 className="text-xl font-serif font-bold text-stone-800 mb-2 group-hover:text-emerald-800 transition-colors">
                    {suggestion.name}
                  </h4>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-400">Used Ingredients</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.usedIngredients.map((ing, i) => (
                      <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md font-medium border border-emerald-100">
                        {ing}
                      </span>
                    ))}
                  </div>
                  
                  {suggestion.missingIngredients.length > 0 && (
                    <>
                      <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mt-2">Missing / Pantry Staples</div>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.missingIngredients.map((ing, i) => (
                          <span key={i} className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-md font-medium border border-stone-200">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => onSelectSuggestion(suggestion.name)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 hover:bg-orange-700 hover:text-white text-stone-700 rounded-lg font-bold transition-all group/btn"
                >
                  <span>Cook this dish</span>
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
