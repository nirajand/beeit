
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Article } from '../types';

const ArticlesSection: React.FC = () => {
  const { articles, previewMode, addArticleComment } = useData();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });
  
  // Filter States
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Derive unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>(['All']);
    articles.forEach(article => {
        article.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let result = previewMode ? articles : articles.filter(a => a.status === 'published');
    
    if (selectedTag !== 'All') {
        result = result.filter(a => a.tags.includes(selectedTag));
    }

    return result.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, previewMode, selectedTag, sortOrder]);

  const selectedArticle = selectedArticleId ? articles.find(a => a.id === selectedArticleId) : null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticleId || !commentForm.name || !commentForm.text) return;

    addArticleComment(selectedArticleId, {
      id: `c_${Date.now()}`,
      author: commentForm.name,
      date: new Date().toISOString(),
      content: commentForm.text
    });
    setCommentForm({ name: '', text: '' });
  };

  if (selectedArticle) {
    return (
      <div className="pt-24 md:pt-32 pb-20 max-w-4xl mx-auto px-6 md:px-8 min-h-screen animate-in fade-in slide-in-from-right duration-500">
        <button 
          onClick={() => { setSelectedArticleId(null); window.scrollTo(0, 0); }}
          className="mb-8 text-xs font-bold text-gray-500 hover:text-hive-blue dark:hover:text-white flex items-center transition-colors uppercase tracking-widest"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i> Return to Feed
        </button>

        <div className="relative rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl">
            <img 
            src={selectedArticle.image} 
            alt={selectedArticle.title} 
            className="w-full h-64 md:h-96 object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedArticle.tags.map(tag => (
                        <span key={tag} className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">#{tag}</span>
                    ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight font-heading mb-2 drop-shadow-lg">
                    {selectedArticle.title}
                </h1>
            </div>
        </div>

        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-8 mb-8">
           <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-hive-gold text-hive-blue rounded-full flex items-center justify-center font-bold text-xl">
                  {(selectedArticle.author || "?").charAt(0)}
               </div>
               <div>
                  <p className="font-bold text-hive-blue dark:text-white text-sm">By {selectedArticle.author}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(selectedArticle.date).toLocaleDateString()}</p>
               </div>
           </div>
           <div className="bg-gray-100 dark:bg-white/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-300">
              <i className="fa-regular fa-clock mr-2"></i> {selectedArticle.readTime}
           </div>
        </div>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-loose font-body"
          dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
        />

        {/* Comment Section */}
        <div className="mt-20 pt-12 border-t border-gray-100 dark:border-white/10">
          <h3 className="text-2xl font-bold text-hive-blue dark:text-white mb-8">Discussion</h3>
          
          <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2rem] mb-12">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <input 
                  type="text" 
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                  className="w-full bg-white dark:bg-black/20 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none"
                  placeholder="Your Name"
                  required
                />
              <textarea 
                  rows={3}
                  value={commentForm.text}
                  onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
                  className="w-full bg-white dark:bg-black/20 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-hive-gold outline-none resize-none"
                  placeholder="Share your thoughts..."
                  required
                />
              <button type="submit" className="bg-hive-blue text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-hive-gold transition-colors shadow-lg">Post</button>
            </form>
          </div>

          <div className="space-y-6">
            {selectedArticle.comments && selectedArticle.comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center font-bold text-gray-500 shrink-0">
                    {comment.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-hive-blue dark:text-white text-sm">{comment.author}</span>
                      <span className="text-[10px] text-gray-400">• {new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
            <h1 className="text-6xl font-black text-hive-blue dark:text-white mb-4 font-heading">Hive Insights</h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">Thought leadership and technical deep-dives from our community.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col gap-4 items-end">
            <div className="flex gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
               <button onClick={() => setSortOrder('newest')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${sortOrder === 'newest' ? 'bg-white dark:bg-hive-blue shadow text-hive-blue dark:text-white' : 'text-gray-500'}`}>Newest</button>
               <button onClick={() => setSortOrder('oldest')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${sortOrder === 'oldest' ? 'bg-white dark:bg-hive-blue shadow text-hive-blue dark:text-white' : 'text-gray-500'}`}>Oldest</button>
            </div>
            
            <div className="flex flex-wrap justify-end gap-2 max-w-md">
               {allTags.map(tag => (
                   <button 
                     key={tag} 
                     onClick={() => setSelectedTag(tag)}
                     className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${selectedTag === tag ? 'bg-hive-gold text-hive-blue border-hive-gold' : 'border-gray-200 dark:border-white/10 text-gray-500 hover:border-hive-gold'}`}
                   >
                       {tag}
                   </button>
               ))}
            </div>
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, idx) => (
            <div 
                key={article.id} 
                onClick={() => { setSelectedArticleId(article.id); window.scrollTo(0, 0); }}
                className="group cursor-pointer bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 hover:border-hive-gold transition-all duration-300 hover:shadow-2xl flex flex-col h-full"
                style={{ animationDelay: `${idx * 100}ms` }}
            >
                <div className="h-60 overflow-hidden relative shrink-0">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-hive-blue uppercase tracking-widest shadow-lg">
                        {article.readTime}
                    </span>
                </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                <div className="flex gap-2 mb-4">
                    {article.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-black text-hive-gold uppercase tracking-wider">#{tag}</span>
                    ))}
                </div>
                <h3 className="text-2xl font-bold text-hive-blue dark:text-white mb-3 group-hover:text-hive-gold transition-colors leading-tight font-heading">
                    {article.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{new Date(article.date).toLocaleDateString()}</span>
                    <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400 group-hover:bg-hive-gold group-hover:text-white transition-all">
                        <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform"></i>
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>
      ) : (
          <div className="text-center py-20">
              <p className="text-gray-400 font-bold uppercase tracking-widest">No articles found matching "{selectedTag}"</p>
          </div>
      )}
    </div>
  );
};

export default ArticlesSection;
