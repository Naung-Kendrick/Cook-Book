import React, { useState, useEffect } from 'react';
import { Recipe, RecipeFormData, RecipeCategory } from '../types';
import { X, Sparkles, Loader2, Save, Scroll, AlertTriangle } from 'lucide-react';
import { generateRecipeWithAI } from '../services/geminiService';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RecipeFormData) => Promise<void>;
  initialData?: Recipe | null;
  initialAiPrompt?: string;
}

const CATEGORIES: RecipeCategory[] = [
  'Drinks',
  'Soups',
  'Grilled Food',
  'Myanmar Traditional Food',
  'Thai Traditional Food',
  'Ta\'ang (Palaung) Traditional Food',
  'Other'
];

export const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, onSave, initialData, initialAiPrompt }) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    ingredients: '',
    steps: '',
    cookingTime: 30,
    imageUrl: '',
    category: 'Other'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (initialData) {
        setFormData({
          name: initialData.name,
          ingredients: initialData.ingredients.join('\n'),
          steps: initialData.steps.join('\n'),
          cookingTime: initialData.cookingTime,
          imageUrl: initialData.imageUrl || '',
          category: initialData.category || 'Other'
        });
        setActiveTab('manual');
      } else {
        setFormData({
          name: '',
          ingredients: '',
          steps: '',
          cookingTime: 30,
          imageUrl: '',
          category: 'Other'
        });
        
        if (initialAiPrompt) {
          setActiveTab('ai');
          setAiPrompt(initialAiPrompt);
        } else {
          setActiveTab('manual');
          setAiPrompt('');
        }
      }
    }
  }, [isOpen, initialData, initialAiPrompt]);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setError('');
    try {
      const generated = await generateRecipeWithAI(aiPrompt);
      setFormData({
        ...generated,
        imageUrl: formData.imageUrl
      });
      setActiveTab('manual');
    } catch (err: any) {
      console.error("Failed to generate", err);
      // Nice error message handling
      const errorMessage = err.message || "Unable to generate recipe.";
      if (errorMessage.includes("API Key")) {
        setError("Vercel Setup: Please rename your Env Variable to 'VITE_API_KEY' (or 'REACT_APP_API_KEY') and Redeploy.");
      } else {
        setError("Chef is busy! " + errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-sm p-4">
      <div className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-orange-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-8 py-5 bg-white">
          <div className="flex items-center gap-3">
             <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
               <Scroll size={20} strokeWidth={2.5} />
             </div>
             <h2 className="text-2xl font-serif font-bold text-stone-800">
              {initialData ? 'Edit Recipe' : 'New Recipe'}
             </h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Tabs */}
        {!initialData && (
          <div className="flex border-b border-stone-100 bg-stone-50">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${
                activeTab === 'manual' ? 'border-b-2 border-orange-500 text-orange-600 bg-white' : 'text-stone-500 hover:bg-white hover:text-orange-500'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'ai' ? 'border-b-2 border-orange-500 text-orange-600 bg-white' : 'text-stone-500 hover:bg-white hover:text-orange-500'
              }`}
            >
              <Sparkles size={16} /> AI Chef
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
          {activeTab === 'ai' && !initialData ? (
            <div className="flex h-full flex-col justify-center space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-4 ring-orange-100">
                <Sparkles size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-bold text-stone-800">What are you craving?</h3>
                <p className="text-stone-500 max-w-sm mx-auto">
                  Describe the dish and our AI Chef will write down the ingredients and instructions for you.
                </p>
              </div>
              <div className="mx-auto w-full max-w-md space-y-4">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Spicy Thai Basil Chicken..."
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-stone-800 placeholder:text-stone-400 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all bg-white"
                  rows={3}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {isGenerating ? 'Cooking up magic...' : 'Generate Recipe'}
                </button>
                {error && (
                  <div className="flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl text-left border border-red-100">
                    <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form id="recipeForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 p-3 font-serif text-lg text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="e.g., Grandma's Apple Pie"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RecipeCategory })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">
                    Time (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">
                  Ingredients <span className="text-[10px] lowercase text-stone-400 font-normal">(one per line)</span>
                </label>
                <textarea
                  required
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 whitespace-pre-wrap"
                  placeholder="- 2 cups flour&#10;- 1 tsp salt"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-stone-400">
                  Instructions
                </label>
                <textarea
                  required
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 p-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="1. Preheat oven...&#10;2. Mix ingredients..."
                />
              </div>

              <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className="rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wide text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all hover:-translate-y-0.5"
                >
                   {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                   {isSaving ? 'Saving...' : 'Save Recipe'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};