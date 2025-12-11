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
    const prompt = encodeURIComponent(`${name} ${category} food authentic rustic photography wooden table`);
    return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${name.length}`;
  };

  const displayImage = recipe.imageUrl || getSmartPlaceholderImage(recipe.name, recipe.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/75 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div 
        className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#FDFBF7] shadow-2xl ring-1 ring-white/10"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-black/20 p-2 text-white hover:bg-black/40 backdrop-blur-md transition-all hover:rotate-90"
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
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
               <span className="inline-flex items-center rounded-lg bg-orange-600/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm backdrop-blur-md border border-white/20">
                {recipe.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-black/40 px-3 py-1 text-xs font-bold uppercase tracking-widest text-stone-200 backdrop-blur-md border border-white/10">
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
            <div className="flex flex-wrap gap-4 sm:gap-8 border-b border-stone-200 pb-8 mb-8">
              <div className="flex items-center gap-3 text-stone-700">
                <div className="p-2.5 bg-orange-100 text-orange-700 rounded-full">
                   <Clock size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Time</p>
                  <p className="font-serif text-xl font-bold">{recipe.cookingTime} mins</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-stone-700">
                <div className="p-2.5 bg-orange-100 text-orange-700 rounded-full">
                   <Utensils size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Ingredients</p>
                  <p className="font-serif text-xl font-bold">{recipe.ingredients.length} items</p>
                </div>
              </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              {/* Ingredients Column */}
              <div className="lg:col-span-5 space-y-6">
                <h3 className="font-serif text-2xl font-bold text-stone-800 flex items-center gap-2">
                  Ingredients
                </h3>
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-stone-100">
                  <ul className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 group">
                        <div className="mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-orange-200 bg-transparent group-hover:bg-orange-400 transition-colors shrink-0" />
                        <span className="text-stone-600 font-medium leading-relaxed group-hover:text-stone-900 transition-colors">
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
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 font-serif text-lg font-bold text-stone-400 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-sm">
                          {index + 1}
                        </span>
                        {index !== recipe.steps.length - 1 && (
                          <div className="w-0.5 h-full bg-stone-100 my-2 group-hover:bg-orange-100 transition-colors" />
                        )}
                      </div>
                      <p className="pt-1.5 text-lg text-stone-600 leading-relaxed group-hover:text-stone-800 transition-colors">
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