
import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, AlertCircle, Refrigerator } from 'lucide-react';
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
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
          <Refrigerator size={32} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-800">The Pantry Chef</h2>
          <div className="h-1 w-16 bg-emerald-600 mx-auto my-4"></div>
          <p className="text-stone-500 max-w-lg mx-auto font-serif text-lg leading-relaxed">
            Turn your leftovers into a feast. Tell us what you have.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden mb-16 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
        <form onSubmit={handleSearch} className="p-8 md:p-10">
          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-stone-400">Your Ingredients</div>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g. 2 eggs, leftover rice, soy sauce..."
            className="w-full h-32 text-xl bg-stone-50 border-b-2 border-stone-200 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors resize-none placeholder:text-stone-300 font-serif leading-relaxed"
          />
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSearching || !ingredients.trim()}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-stone-900 text-white px-10 py-4 rounded-none hover:bg-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-widest text-sm"
            >
              {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isSearching ? 'Creating Menu...' : 'Create Menu'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-4">
             <h3 className="text-2xl font-serif font-bold text-stone-800">
               Chef's Recommendations
             </h3>
             <div className="h-px flex-1 bg-stone-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="group flex flex-col bg-white border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="p-8 flex flex-col flex-1">
                   <h4 className="text-2xl font-serif font-bold text-stone-800 mb-3 group-hover:text-emerald-700 transition-colors">
                    {suggestion.name}
                  </h4>
                  <p className="text-stone-500 font-serif italic mb-6 flex-1">
                    "{suggestion.description}"
                  </p>

                  <div className="space-y-4 pt-6 border-t border-stone-100">
                     <div>
                       <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Using</div>
                       <div className="flex flex-wrap gap-2">
                        {suggestion.usedIngredients.map((ing, i) => (
                          <span key={i} className="text-stone-600 text-xs border-b border-stone-200 pb-0.5">
                            {ing}
                          </span>
                        ))}
                       </div>
                     </div>
                     {suggestion.missingIngredients.length > 0 && (
                       <div>
                         <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">You need</div>
                         <div className="flex flex-wrap gap-2">
                          {suggestion.missingIngredients.map((ing, i) => (
                            <span key={i} className="text-stone-400 text-xs border-b border-stone-100 pb-0.5">
                              {ing}
                            </span>
                          ))}
                         </div>
                       </div>
                     )}
                  </div>
                </div>

                <button
                  onClick={() => onSelectSuggestion(suggestion.name)}
                  className="w-full flex items-center justify-between px-8 py-4 bg-stone-50 hover:bg-stone-900 hover:text-white text-stone-500 font-bold uppercase tracking-widest text-xs transition-colors group/btn"
                >
                  <span>View Recipe</span>
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
