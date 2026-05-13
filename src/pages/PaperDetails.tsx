// ========================================
// Paper Details Page
// ========================================
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Download, Heart, Bookmark, Share2, Calendar, GraduationCap,
  Building2, Clock, ArrowLeft, Send, FileText, Eye,
} from 'lucide-react';

// PDF Viewer
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { usePaperStore } from '@/stores/paperStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, Avatar } from '@/components/ui/Elements';
import { PaperCard } from '@/components/papers/PaperCard';
import { formatNumber, formatRelativeTime, formatDate, getSubjectColor, getSubjectIcon } from '@/lib/utils';

export default function PaperDetails() {
  const { id } = useParams<{ id: string }>();
  const { currentPaper, comments, isLoading, fetchPaperById, toggleLike, toggleBookmark, addComment, trendingPapers, fetchTrending } = usePaperStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();
  const [commentText, setCommentText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // PDF viewer plugin
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => { if (id) fetchPaperById(id); fetchTrending(); }, [id]); // eslint-disable-line

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { addToast({ type: 'info', message: 'Sign in to comment' }); return; }
    if (!commentText.trim() || !currentPaper) return;
    addComment(currentPaper.id, commentText.trim());
    setCommentText('');
    addToast({ type: 'success', message: 'Comment added!' });
  };

  const handleDownload = () => {
    const url = paper.file_url || (paper as any).pdf_url;
    if (!url || url === '#') {
      addToast({ type: 'error', message: 'No file available to download' });
      return;
    }
    // Open in new tab — works for Supabase public URLs
    window.open(url, '_blank');
    addToast({ type: 'success', message: 'Download started!' });
  };

  if (isLoading || !currentPaper) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-[var(--color-bg-tertiary)]" />
          <div className="h-64 rounded-2xl bg-[var(--color-bg-tertiary)]" />
        </div>
      </div>
    );
  }

  const paper = currentPaper;
  const pdfUrl = paper.file_url || (paper as any).pdf_url;
  const hasPdf = pdfUrl && pdfUrl !== '#';
  const related = trendingPapers.filter(p => p.id !== paper.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/browse" className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Paper Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card padding="lg">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="primary">{paper.subject}</Badge>
                {paper.course && <Badge variant="default">{paper.course}</Badge>}
                {paper.semester && <Badge variant="default">Sem {paper.semester}</Badge>}
                {paper.year && <Badge variant="default">{paper.year}</Badge>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">{paper.title}</h1>
              {paper.description && (
                <p className="text-secondary text-sm leading-relaxed mb-6">{paper.description}</p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="md"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleDownload}
                  disabled={!hasPdf}
                >
                  Download PDF
                </Button>

                {hasPdf && (
                  <Button
                    variant="secondary"
                    size="md"
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : 'Preview PDF'}
                  </Button>
                )}

                <button
                  onClick={() => { if (!isAuthenticated) { addToast({ type: 'info', message: 'Sign in to like' }); return; } toggleLike(paper.id); }}
                  className={`p-2.5 rounded-xl border border-themed transition-colors ${paper.is_liked ? 'text-[var(--color-error)] border-[var(--color-error)]/30 bg-[var(--color-error)]/5' : 'text-secondary hover:text-primary'}`}>
                  <Heart className={`w-5 h-5 ${paper.is_liked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => { if (!isAuthenticated) { addToast({ type: 'info', message: 'Sign in to bookmark' }); return; } toggleBookmark(paper.id); }}
                  className={`p-2.5 rounded-xl border border-themed transition-colors ${paper.is_bookmarked ? 'text-accent border-[var(--color-accent)]/30 accent-light-bg' : 'text-secondary hover:text-primary'}`}>
                  <Bookmark className={`w-5 h-5 ${paper.is_bookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); addToast({ type: 'success', message: 'Link copied!' }); }}
                  className="p-2.5 rounded-xl border border-themed text-secondary hover:text-primary transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </Card>
          </motion.div>

          {/* PDF Preview */}
          {showPreview && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <Card padding="none" className="overflow-hidden">
                {hasPdf ? (
                  <div style={{ height: '700px' }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={pdfUrl}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  </div>
                ) : (
                  <div className="h-[500px] flex items-center justify-center bg-[var(--color-bg-tertiary)]">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-tertiary mx-auto mb-4 opacity-40" />
                      <p className="text-secondary text-sm">No PDF available</p>
                      <p className="text-xs text-tertiary mt-1">This paper doesn't have an attached file</p>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Comments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-primary mb-6">Comments ({comments.length})</h2>
              <form onSubmit={handleComment} className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 card-bg border border-themed rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-tertiary"
                />
                <Button type="submit" size="md" icon={<Send className="w-4 h-4" />}>Send</Button>
              </form>
              <div className="space-y-4">
                {comments.length === 0 && (
                  <p className="text-sm text-tertiary text-center py-4">No comments yet. Be the first!</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <Avatar name={c.user?.name || 'User'} src={c.user?.avatar || null} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-primary">{c.user?.name ?? 'User'}</span>
                        <span className="text-xs text-tertiary">{formatRelativeTime(c.created_at)}</span>
                      </div>
                      <p className="text-sm text-secondary">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="text-sm font-semibold text-primary mb-4">Paper Details</h3>
            <div className="space-y-3">
              {[
                { icon: <GraduationCap className="w-4 h-4" />, label: 'Subject', value: paper.subject },
                { icon: <Building2 className="w-4 h-4" />, label: 'University', value: paper.university },
                { icon: <Calendar className="w-4 h-4" />, label: 'Year', value: paper.year },
                { icon: <Clock className="w-4 h-4" />, label: 'Uploaded', value: formatDate(paper.created_at) },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-themed last:border-0">
                  <div className="flex items-center gap-2 text-secondary text-sm">{item.icon}{item.label}</div>
                  <span className="text-sm font-medium text-primary">{item.value ?? '-'}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="text-sm font-semibold text-primary mb-4">Statistics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { value: formatNumber(paper.downloads), label: 'Downloads' },
                { value: formatNumber(paper.likes), label: 'Likes' },
                { value: comments.length.toString(), label: 'Comments' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-tertiary">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {paper.uploader && (
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-primary mb-4">Uploaded By</h3>
              <div className="flex items-center gap-3">
                <Avatar name={paper.uploader.name ?? 'User'} src={paper.uploader.avatar} size="lg" />
                <div>
                  <p className="font-medium text-primary">{paper.uploader.name}</p>
                  <p className="text-xs text-tertiary">{paper.uploader.university}</p>
                </div>
              </div>
            </Card>
          )}

          {paper.tags && paper.tags.length > 0 && (
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-primary mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <Link key={tag} to={`/browse?q=${tag}`}>
                    <Badge variant="default">#{tag}</Badge>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Related Papers */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-primary mb-6">Related Papers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (<PaperCard key={p.id} paper={p} index={i} />))}
          </div>
        </div>
      )}
    </div>
  );
}
