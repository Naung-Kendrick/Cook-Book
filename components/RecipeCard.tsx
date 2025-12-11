import React, { useState } from 'react';
import { Recipe } from '../types';
import { Clock, Trash2, Edit2, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onClick: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onEdit, onDelete, onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  const getSmartPlaceholderImage = (name: string, category: string) => {
    const prompt = encodeURIComponent(`${name} ${category} food authentic rustic photography wooden table`);
    return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${name.length}`;
  };

  const displayImage = (!imageError && recipe.imageUrl) 
    ? recipe.imageUrl 
    : getSmartPlaceholderImage(recipe.name, recipe.category);

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Drinks': return 'bg-sky-100 text-sky-900 border-sky-200';
      case 'Soups': return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'Grilled Food': return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'Myanmar Traditional Food': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'Thai Traditional Food': return 'bg-rose-100 text-rose-900 border-rose-200';
      case 'Ta\'ang (Palaung) Traditional Food': return 'bg-lime-100 text-lime-900 border-lime-200';
      default: return 'bg-stone-200 text-stone-700 border-stone-300';
    }
  };

  return (
    <div 
      onClick={() => onClick(recipe)}
      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-stone-100 ring-1 ring-black/5 cursor-pointer"
    >
      {/* Hero Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <img
          src={displayImage}
          alt={recipe.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        
        {/* Category Badge - Stamp style */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest shadow-sm border ${getCategoryStyles(recipe.category)}`}>
            {recipe.category.replace(' Traditional Food', '')}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
           <h3 className="font-serif text-xl font-bold leading-tight text-stone-800 group-hover:text-orange-800 transition-colors line-clamp-2">
            {recipe.name}
          </h3>
        </div>

        {/* Meta Info */}
        <div className="mb-4 flex items-center gap-4 text-stone-500">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <Clock size={14} strokeWidth={2} className="text-orange-700" />
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-stone-300"></div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
            <ChefHat size={14} strokeWidth={2} className="text-orange-700" />
            <span>{recipe.ingredients.length} Items</span>
          </div>
        </div>
        
        {/* Ingredients Preview */}
        <div className="mb-6 flex-1">
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="inline-block px-2 py-1 text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-sm">
                {ing}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs text-stone-400 italic">
                +{recipe.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Actions - Rustic Buttons */}
        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
              className="group/btn flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-orange-700 transition-colors"
            >
              <Edit2 size={16} strokeWidth={2} className="group-hover/btn:scale-110 transition-transform" /> 
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
              className="group/btn flex items-center gap-2 text-sm font-semibold text-stone-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} strokeWidth={2} className="group-hover/btn:scale-110 transition-transform" /> 
              Delete
            </button>
        </div>
      </div>
    </div>
  );
};