import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Clock,
  User,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Share2,
  Bookmark,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const KnowledgeArticleDetail: React.FC = () => {
  const {
    knowledgeArticles,
    selectedArticleId,
    closeKnowledgeArticle,
    openKnowledgeArticle,
    rateArticle,
    openCreateTicketModal,
  } = useApp();

  const [hasRated, setHasRated] = useState<'yes' | 'no' | null>(null);

  const article = knowledgeArticles.find(a => a.id === selectedArticleId);

  if (!article) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-slate-600">Article not found.</p>
        <button
          onClick={closeKnowledgeArticle}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Knowledge Base
        </button>
      </div>
    );
  }

  // Related articles in same category
  const relatedArticles = knowledgeArticles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

  const handleRate = (helpful: boolean) => {
    if (hasRated) return;
    rateArticle(article.id, helpful);
    setHasRated(helpful ? 'yes' : 'no');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top back button */}
      <button
        onClick={closeKnowledgeArticle}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Knowledge Base</span>
      </button>

      {/* Main Article Container */}
      <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Metadata */}
        <div className="space-y-3 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-blue-600">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Updated{' '}
                {new Date(article.updatedAt).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readTimeMinutes} min read</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Authored by:</span>
            <span className="font-semibold text-slate-800">{article.author}</span>
            <span className="text-slate-400">({article.authorTeam})</span>
          </div>
        </div>

        {/* Problem Section */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Problem Description</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
            {article.problem}
          </p>
        </div>

        {/* Possible Causes */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Possible Causes
          </h2>
          <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {article.possibleCauses.map((cause, i) => (
              <li key={i} className="leading-relaxed">
                {cause}
              </li>
            ))}
          </ul>
        </div>

        {/* Step-by-Step Troubleshooting */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Step-by-Step Troubleshooting Steps</span>
          </h2>

          <div className="space-y-2.5">
            {article.troubleshootingSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs sm:text-sm"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  {idx + 1}
                </div>
                <div className="flex-1 text-slate-800 leading-relaxed pt-0.5">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* When to contact IT */}
        <div className="space-y-2 bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>When to Contact IT Support</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {article.whenToContactIT}
          </p>

          <div className="pt-2">
            <button
              onClick={() =>
                openCreateTicketModal({
                  title: `Support request: ${article.title}`,
                  category: article.category,
                  description: `Followed knowledge guide #${article.id} (${article.title}) but issue persisted.\nAttempted troubleshooting steps:\n${article.troubleshootingSteps.map(s => `- ${s}`).join('\n')}`,
                  affectedService: `${article.category} Service`,
                })
              }
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 underline underline-offset-2"
            >
              Open a support ticket for this issue →
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-semibold text-slate-900">Was this article helpful?</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {article.helpfulCount} people found this helpful
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRate(true)}
              disabled={hasRated !== null}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                hasRated === 'yes'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Yes, resolved my issue</span>
            </button>

            <button
              onClick={() => handleRate(false)}
              disabled={hasRated !== null}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                hasRated === 'no'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>No, need IT help</span>
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Related Knowledge Articles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map(rel => (
              <div
                key={rel.id}
                onClick={() => openKnowledgeArticle(rel.id)}
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all space-y-2 group"
              >
                <span className="text-[11px] font-semibold text-blue-600">{rel.category}</span>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>{rel.readTimeMinutes} min read</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
