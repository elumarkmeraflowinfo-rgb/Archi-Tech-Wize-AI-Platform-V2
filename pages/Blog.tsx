import React, { useState } from 'react';
import { useAdmin, BlogPost } from '../context/AdminContext';
import { useUser } from '../context/UserContext';
import { Calendar, User, ArrowRight, X, MessageCircle, Send, Search } from 'lucide-react';
import Button from '../components/Button';
import AuthModal from '../components/AuthModal';

const Blog: React.FC = () => {
  const { posts, addComment } = useAdmin();
  const { user, isAuthenticated } = useUser();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Derive categories from posts
  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];

  const publishedPosts = posts.filter(p => {
      const isPublished = p.status === 'published';
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.content.toLowerCase().includes(searchQuery.toLowerCase());
      return isPublished && matchesCategory && matchesSearch;
  });

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim()) return;
    
    if (!isAuthenticated) {
        setShowAuthModal(true);
        return;
    }

    const commentData = {
        user: user?.name || 'Anonymous',
        text: newComment,
    };

    addComment(selectedPost.id, commentData);
    setNewComment('');
    
    // Optimistically update the selected post view
    setSelectedPost(prev => prev ? ({
        ...prev,
        comments: [...(prev.comments || []), { ...commentData, id: 'temp', date: new Date().toISOString() }]
    }) : null);
  };

  return (
    <div className="w-full min-h-screen pt-32 pb-24 relative z-10">
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} triggerAction="post a comment" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-bold font-display text-slate-900 mb-4">ArchiTech Insights</h1>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto">Latest updates, tutorials, and success stories from the community.</p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 max-w-6xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar bg-white/80 backdrop-blur-sm p-1 rounded-full border border-slate-200">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search articles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent bg-white/90"
                />
            </div>
        </div>

        {publishedPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No posts found matching your criteria.</p>
            <button onClick={() => {setActiveCategory('All'); setSearchQuery('');}} className="mt-4 text-brand-primary hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
             {publishedPosts.map(post => (
               <article key={post.id} className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer hover:-translate-y-1" onClick={() => setSelectedPost(post)}>
                 {post.image && (
                   <div className="h-48 overflow-hidden relative">
                     <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                        {post.category}
                     </div>
                   </div>
                 )}
                 <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                       <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                       <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-slate-900 mb-3 group-hover:text-brand-primary transition-colors leading-tight">{post.title}</h2>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 flex-grow">{post.excerpt || post.content.substring(0, 100)}...</p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><MessageCircle size={12}/> {post.comments?.length || 0} comments</span>
                        <span className="text-brand-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                           Read <ArrowRight size={14} />
                        </span>
                    </div>
                 </div>
               </article>
             ))}
          </div>
        )}
      </div>

      {/* ARTICLE MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-4xl min-h-[50vh] max-h-[90vh] shadow-2xl overflow-hidden flex flex-col relative animate-fade-in-up">
                
                {/* Header Image */}
                {selectedPost.image && (
                    <div className="h-64 w-full relative shrink-0">
                        <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-20"><X size={20}/></button>
                    </div>
                )}
                {!selectedPost.image && (
                    <div className="absolute top-4 right-4 z-10">
                        <button onClick={() => setSelectedPost(null)} className="bg-slate-100 text-slate-500 p-2 rounded-full hover:bg-slate-200 transition-colors"><X size={20}/></button>
                    </div>
                )}

                <div className="p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                        <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full font-bold">{selectedPost.category}</span>
                        <span>{selectedPost.date}</span>
                        <span className="flex items-center gap-1"><User size={14}/> {selectedPost.author}</span>
                    </div>

                    {/* Content */}
                    <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-8 leading-tight">{selectedPost.title}</h1>
                    <div className="prose prose-slate max-w-none prose-lg mb-16 text-slate-600">
                        <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-slate-100 pt-12 bg-slate-50 -mx-8 -mb-12 px-8 pb-12 md:px-12">
                        <h3 className="text-2xl font-bold font-display text-slate-900 mb-8 flex items-center gap-2">
                            <MessageCircle className="text-brand-primary" /> Discussion ({selectedPost.comments?.length || 0})
                        </h3>

                        {/* Comment List */}
                        <div className="space-y-4 mb-8">
                            {(!selectedPost.comments || selectedPost.comments.length === 0) && (
                                <p className="text-slate-400 italic text-center py-4">No comments yet. Be the first to share your thoughts.</p>
                            )}
                            {selectedPost.comments?.map((comment, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                {comment.user.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-900 text-sm">{comment.user}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{new Date(comment.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm pl-10">{comment.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Comment Form */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Leave a Reply</h4>
                            <form onSubmit={handleAddComment}>
                                <textarea 
                                    required
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={isAuthenticated ? "Share your perspective..." : "Please login to comment..."}
                                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-primary outline-none resize-none bg-slate-50 focus:bg-white transition-all mb-4"
                                    rows={3}
                                />
                                <div className="flex justify-end">
                                    <button 
                                        type="submit" 
                                        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
                                    >
                                        Post Comment <Send size={16} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Blog;