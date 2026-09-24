import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketCategory } from '../../types';
import {
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Wifi,
  Laptop,
  Layers,
  Mail,
  KeyRound,
  Printer,
  Lock,
  ThumbsUp,
  Clock,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  VPN: ShieldCheck,
  Network: Wifi,
  Hardware: Laptop,
  Software: Layers,
  Email: Mail,
  'Account & Password': KeyRound,
  Printer: Printer,
  Security: Lock,
};

export const KnowledgeBaseView: React.FC = () => {
  const { knowledgeArticles, openKnowledgeArticle } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Network',
    'VPN',
    'Hardware',
    'Software',
    'Email',
    'Account & Password',
    'Printer',
    'Security',
  ];

  // Filter articles
  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter(art => {
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [knowledgeArticles, selectedCategory, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Knowledge Base
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Find troubleshooting guides, self-service solutions, and official IT support documentation.
        </p>

        {/* Big Search Bar */}
        <div className="relative pt-3">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-6" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search for an IT problem (e.g. VPN timeout, WiFi certificate, Outlook sync)..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-xs text-sm focus:outline-hidden focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Category Pills / Cards */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Browse by Category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categories.map(cat => {
            const Icon = CATEGORY_ICONS[cat] || BookOpen;
            const isSelected = selectedCategory === cat;
            const count =
              cat === 'All'
                ? knowledgeArticles.length
                : knowledgeArticles.filter(a => a.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all shadow-2xs ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs truncate w-full">{cat}</span>
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">{count} guides</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Troubleshooting Guides ({filteredArticles.length})
          </p>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Clear category filter
            </button>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No articles matched your query</p>
            <p className="text-xs text-slate-400 mt-1">Try different keywords or browse all categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map(article => (
              <div
                key={article.id}
                onClick={() => openKnowledgeArticle(article.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-blue-600">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{article.readTimeMinutes} min read</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    <span className="font-mono tabular-nums">{article.helpfulCount} found helpful</span>
                  </div>

                  <span className="font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    <span>View Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
