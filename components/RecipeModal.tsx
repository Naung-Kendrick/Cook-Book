
import React, { useState, useEffect } from 'react';
import { Recipe, RecipeFormData, RecipeCategory } from '../types';
import { X, Sparkles, Loader2, Save, Scroll } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
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
    try {
      const generated = await generateRecipeWithAI(aiPrompt);
      setFormData({
        ...generated,
        imageUrl: formData.imageUrl
      });
      setActiveTab('manual');
    } catch (error) {
      console.error("Failed to generate", error);
      alert("Failed to generate recipe. Please check your API key.");
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
      <div className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-[#FDFBF7] shadow-2xl ring-1 ring-stone-900/5">
        {/* Rustic Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-8 py-5 bg-white/50">
          <div className="flex items-center gap-3">
             <div className="bg-orange-100 p-2 rounded-lg text-orange-800">
               <Scroll size={20} />
             </div>
             <h2 className="text-2xl font-serif font-bold text-stone-800">
              {initialData ? 'Edit Recipe' : 'New Recipe'}
             </h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* Tabs */}
        {!initialData && (
          <div className="flex border-b border-stone-200 bg-stone-50">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${
                activeTab === 'manual' ? 'border-b-2 border-orange-600 text-orange-800 bg-white' : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'ai' ? 'border-b-2 border-purple-600 text-purple-800 bg-white' : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              <Sparkles size={16} /> AI Chef
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'ai' && !initialData ? (
            <div className="flex h-full flex-col justify-center space-y-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-50 text-purple-600 ring-4 ring-purple-100">
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
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-stone-800 placeholder:text-stone-400 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all bg-white"
                  rows={3}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-700 py-3.5 font-bold text-white shadow-lg shadow-purple-900/20 transition-all hover:bg-purple-800 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {isGenerating ? 'Cooking up magic...' : 'Generate Recipe'}
                </button>
              </div>
            </div>
          ) : (
            <form id="recipeForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-stone-600">Recipe Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border-2 border-stone-200 bg-white px-4 py-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-serif text-lg"
                  placeholder="Grandma's Secret Sauce"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                   <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-stone-600">Category</label>
                   <select
                     value={formData.category}
                     onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                     className="w-full rounded-lg border-2 border-stone-200 bg-white px-4 py-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer"
                   >
                     {CATEGORIES.map(cat => (
                       <option key={cat} value={cat}>{cat}</option>
                     ))}
                   </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-stone-600">Time (mins)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border-2 border-stone-200 bg-white px-4 py-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-stone-600">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded-lg border-2 border-stone-200 bg-white px-4 py-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-stone-600">Ingredients</label>
                <textarea
                  required
                  rows={5}
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full rounded-lg border-2 border-stone-200 bg-white px-4 py-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all font-mono text-sm leading-relaxed"
                  placeholder="2 cups flour&#10;1 tsp cinnamon"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wider text-stone-600">Instructions</label>
                <textarea
                  required
                  rows={5}
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full rounded-lg border-2 border-stone-200 bg-white px-4 py-3 text-stone-800 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/10 transition-all text-sm leading-relaxed"
                  placeholder="1. Preheat the oven...&#10;2. Mix the dry ingredients..."
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'manual' && (
          <div className="flex items-center justify-end gap-3 border-t border-stone-200 bg-stone-50 px-8 py-5">
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg px-5 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="recipeForm"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-orange-700 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-900/20 hover:bg-orange-800 hover:-translate-y-0.5 transition-all disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {initialData ? 'Update Recipe' : 'Save to Cookbook'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
