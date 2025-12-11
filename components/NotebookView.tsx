import React, { useState, useEffect } from 'react';
import { NotebookEntry } from '../types';
import * as storageService from '../services/storageService';
import { PenTool, Trash2, Plus, Save } from 'lucide-react';

export const NotebookView: React.FC = () => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // New entry form state
  const [newTitle, setNewTitle] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const data = await storageService.getNotebookEntries();
    setEntries(data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    await storageService.saveNotebookEntry({
      title: newTitle,
      source: newSource || 'Unknown',
      content: newContent
    });

    setNewTitle('');
    setNewSource('');
    setNewContent('');
    setIsAdding(false);
    loadEntries();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tear this page out of your notebook?")) {
      await storageService.deleteNotebookEntry(id);
      loadEntries();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Notebook Header */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-4xl font-handwriting font-bold text-stone-800">My Kitchen Notebook</h2>
        <p className="text-stone-500 italic">"Scraps of wisdom and recipes from friends"</p>
      </div>

      {/* Add New Note Section */}
      <div className="mb-12">
        {!isAdding ? (
          <button 
            onClick={() => setIsAdding(true)}
            className="mx-auto flex items-center gap-2 bg-stone-800 text-stone-50 px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={20} />
            <span>Jot Down a New Recipe</span>
          </button>
        ) : (
          <div className="bg-[#fcfbf9] p-6 sm:p-8 rounded-xl shadow-xl border border-stone-200 relative transform transition-all">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 opacity-50 rounded-t-xl" />
             
             <h3 className="font-handwriting text-2xl text-stone-800 mb-6">New Entry</h3>
             
             <form onSubmit={handleSave} className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                   <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Title</label>
                   <input 
                      type="text" 
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Grandma's Secret Sauce"
                      className="w-full bg-transparent border-b-2 border-stone-200 py-2 font-serif text-lg focus:border-orange-500 focus:outline-none transition-colors placeholder:text-stone-300"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Learned From</label>
                   <input 
                      type="text" 
                      value={newSource}
                      onChange={e => setNewSource(e.target.value)}
                      placeholder="e.g. Auntie May"
                      className="w-full bg-transparent border-b-2 border-stone-200 py-2 font-serif text-lg focus:border-orange-500 focus:outline-none transition-colors placeholder:text-stone-300"
                   />
                 </div>
               </div>
               
               <div className="mt-4 bg-yellow-50/50 p-4 rounded-lg border border-yellow-100 relative">
                 {/* Lined paper lines CSS trick */}
                 <div className="absolute inset-0 pointer-events-none" 
                      style={{
                        backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                        backgroundSize: '100% 2rem',
                        marginTop: '2.1rem'
                      }}>
                 </div>
                 <textarea 
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={6}
                    placeholder="Write the recipe here..."
                    className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-2xl text-stone-700 leading-8 resize-none placeholder:text-stone-300 placeholder:font-sans placeholder:text-base placeholder:italic"
                    style={{ lineHeight: '2rem' }}
                 />
               </div>

               <div className="flex justify-end gap-3 pt-4">
                 <button 
                   type="button"
                   onClick={() => setIsAdding(false)}
                   className="px-4 py-2 text-stone-500 hover:text-stone-800 font-bold text-sm"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="flex items-center gap-2 bg-orange-700 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-orange-800 transition-colors"
                 >
                   <Save size={18} /> Save Note
                 </button>
               </div>
             </form>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {entries.map((entry) => (
          <div key={entry.id} className="group relative bg-[#fffdf5] p-6 shadow-md hover:shadow-xl transition-all duration-300 rotate-1 hover:rotate-0 hover:z-10">
             {/* Pin effect */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-red-100 border-2 border-red-200 shadow-sm z-10"></div>
             
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => handleDelete(entry.id)} className="text-stone-300 hover:text-red-500 p-1">
                 <Trash2 size={18} />
               </button>
             </div>

             <div className="border-b-2 border-stone-100 pb-3 mb-4">
               <h3 className="font-handwriting text-3xl font-bold text-stone-800 leading-tight">{entry.title}</h3>
               <p className="text-xs font-bold uppercase tracking-wider text-orange-700 mt-1">From: {entry.source}</p>
             </div>
             
             <div className="font-handwriting text-2xl text-stone-600 leading-relaxed whitespace-pre-wrap">
               {entry.content}
             </div>
             
             <div className="mt-6 pt-4 border-t border-dashed border-stone-200 text-right">
               <span className="text-xs text-stone-400 font-mono">
                 {new Date(entry.createdAt).toLocaleDateString()}
               </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};