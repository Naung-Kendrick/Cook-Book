import React, { useState, useEffect } from 'react';
import { Recipe, RecipeFormData } from '../types';
import { X, Sparkles, Loader2, Save } from 'lucide-react';
import { generateRecipeWithAI } from '../services/geminiService';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RecipeFormData) => Promise<void>;
  initialData?: Recipe | null;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    ingredients: '',
    steps: '',
    cookingTime: 30,
    imageUrl: ''
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
          imageUrl: initialData.imageUrl || ''
        });
        setActiveTab('manual');
      } else {
        // Reset form for new entry
        setFormData({
          name: '',
          ingredients: '',
          steps: '',
          cookingTime: 30,
          imageUrl: ''
        });
        setActiveTab('manual');
        setAiPrompt('');
      }
    }
  }, [isOpen, initialData]);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateRecipeWithAI(aiPrompt);
      setFormData({
        ...generated,
        imageUrl: formData.imageUrl // Keep existing image if user added one, or leave blank
      });
      setActiveTab('manual'); // Switch back to manual view to show results
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="flex h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Recipe' : 'New Recipe'}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Tabs for New Recipe Only */}
        {!initialData && (
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === 'manual' ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50/50' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'ai' ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50/50' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Sparkles size={16} /> Generate with AI
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'ai' && !initialData ? (
            <div className="flex h-full flex-col justify-center space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Sparkles size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">Describe your dish</h3>
                <p className="text-sm text-slate-500">
                  Tell us what you want to cook, and we'll generate the ingredients and steps for you.
                </p>
              </div>
              <div className="mx-auto w-full max-w-md space-y-4">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., A spicy thai green curry with tofu..."
                  className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  rows={3}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  {isGenerating ? 'Dreaming up recipe...' : 'Generate Recipe'}
                </button>
              </div>
            </div>
          ) : (
            <form id="recipeForm" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Recipe Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="Grandma's Apple Pie"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Cooking Time (mins)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Ingredients (one per line)</label>
                <textarea
                  required
                  rows={5}
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-mono"
                  placeholder="- 2 cups flour&#10;- 1 tsp sugar"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Steps (one per line)</label>
                <textarea
                  required
                  rows={5}
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-orange-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  placeholder="1. Preheat oven...&#10;2. Mix ingredients..."
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'manual' && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              onClick={onClose}
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="recipeForm"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-200 hover:bg-orange-700 hover:shadow-orange-300 transition-all disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {initialData ? 'Update Recipe' : 'Save Recipe'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
