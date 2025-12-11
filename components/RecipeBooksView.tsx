import React from 'react';
import { Download, Book, ArrowRight } from 'lucide-react';

const BOOKS = [
  {
    id: 1,
    title: "Myanmar Classics",
    author: "Daw Nu",
    description: "A collection of 50 timeless recipes from the heart of Myanmar.",
    image: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?q=80&w=600&auto=format&fit=crop",
    color: "bg-emerald-800"
  },
  {
    id: 2,
    title: "Soups & Stews",
    author: "Culina Kitchen",
    description: "Warm your soul with these rustic broths and hearty stews.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
    color: "bg-amber-800"
  },
  {
    id: 3,
    title: "The Art of Grilling",
    author: "Chef Marco",
    description: "Master the flame with techniques for meats and vegetables.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop",
    color: "bg-orange-900"
  },
  {
    id: 4,
    title: "Ta'ang Tea Culture",
    author: "Mountain Heritage",
    description: "Explore the culinary traditions of the tea-growing regions.",
    image: "https://images.unsplash.com/photo-1594488516993-9c5950d877f0?q=80&w=600&auto=format&fit=crop",
    color: "bg-lime-900"
  }
];

export const RecipeBooksView: React.FC = () => {
  const handleDownload = (title: string) => {
    alert(`Starting download for "${title}"... (Simulated)`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-serif font-bold text-stone-800">The Library</h2>
        <p className="text-stone-500 max-w-lg mx-auto">
          Expand your culinary knowledge with our curated collection of digital recipe books.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {BOOKS.map((book) => (
          <div key={book.id} className="group relative flex flex-col bg-white rounded-r-2xl rounded-l-sm shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-l-8 border-stone-800/20">
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
                 <p className="text-stone-300 text-xs mt-1">by {book.author}</p>
               </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-sm text-stone-600 mb-4 line-clamp-3 leading-relaxed">
                {book.description}
              </p>
              
              <div className="mt-auto pt-4 border-t border-stone-100">
                <button 
                  onClick={() => handleDownload(book.title)}
                  className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-orange-700 hover:text-white text-stone-700 font-bold py-2.5 px-4 rounded-lg transition-colors text-sm group/btn"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State / Coming Soon */}
      <div className="mt-16 rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/50 p-8 text-center">
        <Book size={32} className="mx-auto text-stone-400 mb-3" />
        <h3 className="text-lg font-bold text-stone-600">More books coming soon</h3>
        <p className="text-sm text-stone-500">We release new collections every season.</p>
      </div>
    </div>
  );
};