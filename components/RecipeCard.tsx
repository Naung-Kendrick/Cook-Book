import React from 'react';
import { Recipe } from '../types';
import { Clock, Trash2, Edit2, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onEdit, onDelete }) => {
  // Use a placeholder if no image provided, using recipe ID to get a consistent random image
  const displayImage = recipe.imageUrl || `https://picsum.photos/seed/${recipe.id}/400/300`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-slate-100">
      <div className="relative h-48 overflow-hidden">
        <img
          src={displayImage}
          alt={recipe.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur-sm shadow-sm flex items-center gap-1">
          <Clock size={12} />
          {recipe.cookingTime} min
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {recipe.name}
        </h3>
        
        <div className="mb-4 flex-1">
          <p className="text-sm text-slate-500 mb-2 font-medium flex items-center gap-1">
             <ChefHat size={14} /> Ingredients preview:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.slice(0, 3).map((ing, i) => (
              <span key={i} className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                {ing}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="inline-block rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-400">
                +{recipe.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              onClick={() => onEdit(recipe)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              <Edit2 size={16} /> Edit
            </button>
            <button
              onClick={() => onDelete(recipe.id)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
        </div>
      </div>
    </div>
  );
};