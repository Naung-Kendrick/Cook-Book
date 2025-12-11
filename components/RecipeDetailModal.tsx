import React from 'react';
import { Recipe } from '../types';
import { X, Clock, Utensils, Calendar } from 'lucide-react';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, isOpen, onClose }) => {
  if (!isOpen || !recipe) return null;

  // Helper for placeholder (duplicated from Card to keep components self-contained)
  const getSmartPlaceholderImage = (name: string, category: string) => {
    const prompt = encodeURIComponent(`${name} ${category} food authentic vibrant restaurant photography wooden table`);
    return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${name.length}`;
  };

  const displayImage = recipe.imageUrl || getSmartPlaceholderImage(recipe.name, recipe.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/85 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div 
        className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-white/10"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-black/40 p-2 text-white hover:bg-orange-500 backdrop-blur-md transition-all hover:rotate-90"
        >
          <X size={24} strokeWidth={2} />
        </button>

        {/* Hero Section */}
        <div className="relative h-72 sm:h-96 w-full shrink-0">
          <img
            src={displayImage}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
               <span className="inline-flex items-center rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-stone-900 shadow-md border-2 border-white">
                {recipe.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md border border-white/20">
                <Calendar size={12} />
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-white shadow-sm">
              {recipe.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 sm:p-10">
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-stone-100 pb-8 mb-8">
              <div className="flex items-center gap-3 text-stone-700">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-full">
                   <Clock size={24} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Time</p>
                  <p className="font-serif text-xl font-bold text-stone-900">{recipe.cookingTime} mins</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-stone-700">
                <div className="p-2.5 bg-orange-50 text-orange-600 rounded-full">
                   <Utensils size={24} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Ingredients</p>
                  <p className="font-serif text-xl font-bold text-stone-900">{recipe.ingredients.length} items</p>
                </div>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              {/* Ingredients Column */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="font-serif text-2xl font-bold text-stone-800 flex items-center gap-2">
                  Ingredients
                </h3>
                <div className="rounded-2xl bg-orange-50/50 p-6 shadow-sm border border-orange-100">
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-orange-400 group-hover:scale-125 transition-transform shrink-0" />
                        <span className="text-stone-700 font-bold text-sm leading-relaxed group-hover:text-orange-900 transition-colors">
                          {ingredient}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions Column */}
              <div className="lg:col-span-7 space-y-6">
                 <h3 className="font-serif text-2xl font-bold text-stone-800">
                  Method
                </h3>
                <div className="space-y-8">
                  {recipe.steps.map((step, index) => (
                    <div key={index} className="group flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 font-bold text-lg text-stone-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                          {index + 1}
                        </span>
                        {index !== recipe.steps.length - 1 && (
                          <div className="w-0.5 h-full bg-stone-100 my-2 group-hover:bg-orange-200 transition-colors" />
                        )}
                      </div>
                      <p className="pt-1.5 text-lg text-stone-600 leading-relaxed group-hover:text-stone-900 transition-colors">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};