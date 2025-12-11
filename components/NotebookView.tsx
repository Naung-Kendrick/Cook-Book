
import React, { useState, useEffect } from 'react';
import { NotebookEntry } from '../types';
import * as storageService from '../services/storageService';
import { Trash2, Plus, Save, PenTool } from 'lucide-react';

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
    if (confirm("Remove this note permanently?")) {
      await storageService.deleteNotebookEntry(id);
      loadEntries();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Notebook Header */}
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-5xl font-handwriting font-bold text-stone-800">Kitchen Notes</h2>
        <div className="flex justify-center text-stone-400">
           <PenTool size={20} />
        </div>
        <p className="text-stone-500 font-serif italic">"Recipes borrowed, learned, and stolen with love."</p>
      </div>

      {/* Add New Note Section */}
      <div className="mb-16">
        {!isAdding ? (
          <div className="text-center">
             <button 
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-none font-bold uppercase tracking-widest text-sm hover:bg-orange-700 transition-colors shadow-lg"
            >
              <Plus size={16} />
              <span>Write a new entry</span>
            </button>
          </div>
        ) : (
          <div className="bg-[#fcfbf9] p-8 md:p-12 shadow-2xl border border-stone-200 relative transform transition-all mx-auto max-w-2xl">
             {/* Tape effect */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/50 backdrop-blur-sm rotate-[-2deg] shadow-sm border border-white/20"></div>

             <h3 className="font-handwriting text-3xl text-stone-800 mb-8 text-center">Dear Diary...</h3>
             
             <form onSubmit={handleSave} className="space-y-6">
               <div className="grid grid-cols-1 gap-6">
                 <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">Title</label>
                   <input 
                      type="text" 
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="Grandma's Secret Sauce"
                      className="w-full bg-stone-50 border border-stone-200 p-3 font-serif text-lg focus:border-orange-500 focus:outline-none transition-colors"
                   />
                 </div>
                 <div>
                   <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-2">Source / Story</label>
                   <input 
                      type="text" 
                      value={newSource}
                      onChange={e => setNewSource(e.target.value)}
                      placeholder="Learned from Auntie May..."
                      className="w-full bg-stone-50 border border-stone-200 p-3 font-serif text-lg focus:border-orange-500 focus:outline-none transition-colors"
                   />
                 </div>
               </div>
               
               <div className="bg-white p-6 border border-stone-200 shadow-inner">
                 <textarea 
                    required
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={8}
                    placeholder="Write the recipe here..."
                    className="w-full bg-transparent border-none focus:ring-0 font-handwriting text-2xl text-stone-600 leading-9 resize-none placeholder:text-stone-300"
                    style={{ 
                      backgroundImage: 'linear-gradient(transparent 95%, #e5e7eb 95%)',
                      backgroundSize: '100% 2.25rem',
                      lineHeight: '2.25rem'
                    }}
                 />
               </div>

               <div className="flex justify-between items-center pt-4 border-t border-stone-100">
                 <button 
                   type="button"
                   onClick={() => setIsAdding(false)}
                   className="text-stone-400 hover:text-stone-800 font-bold uppercase tracking-widest text-xs"
                 >
                   Discard
                 </button>
                 <button 
                   type="submit"
                   className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-orange-700 transition-colors"
                 >
                   <Save size={16} /> Save Entry
                 </button>
               </div>
             </form>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {entries.map((entry, index) => (
          <div key={entry.id} className={`group relative bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 hover:z-10`}>
             
             <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <button onClick={() => handleDelete(entry.id)} className="text-stone-300 hover:text-red-600 p-2 transition-colors">
                 <Trash2 size={16} />
               </button>
             </div>

             <div className="mb-6">
               <div className="flex items-baseline gap-3 mb-2">
                 <span className="text-xs font-bold uppercase tracking-widest text-stone-300">{new Date(entry.createdAt).toLocaleDateString()}</span>
                 <div className="h-px bg-stone-100 flex-1"></div>
               </div>
               <h3 className="font-handwriting text-4xl font-bold text-stone-800">{entry.title}</h3>
               {entry.source && (
                 <p className="text-xs font-serif italic text-orange-800 mt-2">Recorded from: {entry.source}</p>
               )}
             </div>
             
             <div className="font-serif text-stone-600 leading-relaxed whitespace-pre-wrap text-sm border-l-2 border-stone-100 pl-4">
               {entry.content}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
