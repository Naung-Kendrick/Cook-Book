import React from 'react';
import { Download, Book } from 'lucide-react';

const BOOKS = [
  {
    id: 1,
    title: "Myanmar Classics",
    author: "Daw Nu",
    description: "A collection of 50 timeless recipes from the heart of Myanmar.",
    image: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?q=80&w=600&auto=format&fit=crop",
    color: "bg-orange-600"
  },
  {
    id: 2,
    title: "Soups & Stews",
    author: "Culina Kitchen",
    description: "Warm your soul with these rustic broths and hearty stews.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
    color: "bg-orange-500"
  },
  {
    id: 3,
    title: "The Art of Grilling",
    author: "Chef Marco",
    description: "Master the flame with techniques for meats and vegetables.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    color: "bg-stone-900"
  },
  {
    id: 4,
    title: "Ta'ang Tea Culture",
    author: "Mountain Heritage",
    description: "Explore the culinary traditions of the tea-growing regions.",
    image: "https://images.unsplash.com/photo-1594488516993-9c5950d877f0?q=80&w=600&auto=format&fit=crop",
    color: "bg-yellow-600"
  }
];

export const RecipeBooksView: React.FC = () => {
  const handleDownload = (title: string) => {
    alert(`Starting download for "${title}"... (Simulated)`);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-serif font-bold text-stone-800">The Library</h2>
        <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full"></div>
        <p className="text-stone-500 max-w-lg mx-auto font-serif italic">
          Expand your culinary knowledge with our curated collection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {BOOKS.map((book) => (
          <div key={book.id} className="group relative flex flex-col bg-white rounded-r-xl rounded-l-md shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden border-l-[6px] border-stone-800/20">
            {/* Book Spine visual trick */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${book.color}`}></div>
            
            {/* Cover Image */}
            <div className="aspect-[3/4] overflow-hidden relative">
               <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors z-10" />
               <img 
                 src={book.image} 
                 alt={book.title}
                 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                 <h3 className="text-white font-serif font-bold text-xl leading-tight">{book.title}</h3>
                 <p className="text-stone-300 text-xs mt-1 uppercase tracking-wider">by {book.author}</p>
               </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-sm text-stone-600 mb-6 line-clamp-3 leading-relaxed font-serif">
                {book.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-stone-100">
                <button 
                  onClick={() => handleDownload(book.title)}
                  className="w-full flex items-center justify-center gap-2 bg-stone-50 hover:bg-orange-500 hover:text-white text-stone-600 font-bold uppercase tracking-widest text-xs py-3 rounded transition-colors group/btn"
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-stone-400">
        <Book size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-xs font-bold uppercase tracking-widest">More volumes coming soon</p>
      </div>
    </div>
  );
};