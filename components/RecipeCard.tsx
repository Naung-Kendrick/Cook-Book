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
    const prompt = encodeURIComponent(`${name} ${category} food authentic vibrant restaurant photography wooden table`);
    return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true&seed=${name.length}`;
  };

  const displayImage = (!imageError && recipe.imageUrl) 
    ? recipe.imageUrl 
    : getSmartPlaceholderImage(recipe.name, recipe.category);

  return (
    <div 
      onClick={() => onClick(recipe)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg shadow-orange-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-2 border-2 border-white cursor-pointer h-full"
    >
      {/* Hero Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={displayImage}
          alt={recipe.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Category Badge - Sticker Style */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md bg-yellow-400 text-stone-900 border-2 border-white transform -rotate-2 group-hover:rotate-0 transition-transform">
            {recipe.category.replace(' Traditional Food', '')}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
           <h3 className="font-serif text-xl font-bold leading-tight text-stone-800 group-hover:text-orange-600 transition-colors line-clamp-2">
            {recipe.name}
          </h3>
        </div>

        {/* Meta Info */}
        <div className="mb-4 flex items-center gap-4 text-stone-500">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group-hover:text-orange-500 transition-colors">
            <Clock size={14} strokeWidth={2.5} />
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-stone-300"></div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider group-hover:text-orange-500 transition-colors">
            <ChefHat size={14} strokeWidth={2.5} />
            <span>{recipe.ingredients.length} Items</span>
          </div>
        </div>
        
        {/* Ingredients Preview */}
        <div className="mb-6 flex-1">
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-stone-500 bg-stone-50 border border-stone-100 rounded-sm">
                {ing}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="inline-block px-2 py-1 text-[10px] font-bold text-orange-400">
                +{recipe.ingredients.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
              className="group/btn flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-orange-600 transition-colors"
            >
              <Edit2 size={16} strokeWidth={2} className="group-hover/btn:scale-110 transition-transform" /> 
              Edit
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
              className="group/btn flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} strokeWidth={2} className="group-hover/btn:scale-110 transition-transform" /> 
              Delete
            </button>
        </div>
      </div>
    </div>
  );
};