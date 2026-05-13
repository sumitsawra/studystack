// ========================================
// Paper Card Component
// ========================================
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Download, Calendar, FileText } from 'lucide-react';
import type { Paper } from '@/types';
import { Badge, Avatar } from '@/components/ui/Elements';
import { formatNumber, formatRelativeTime, getSubjectColor, getSubjectIcon } from '@/lib/utils';
import { usePaperStore } from '@/stores/paperStore';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

interface PaperCardProps {
  paper: Paper;
  index?: number;
  viewMode?: 'grid' | 'list';
}

export function PaperCard({ paper, index = 0, viewMode = 'grid' }: PaperCardProps) {
  const { toggleLike, toggleBookmark } = usePaperStore();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  // ✅ FIX: Safe defaults for all fields that may be null from Supabase
  const safeDownloads = paper.downloads ?? 0;
  const safeLikes = paper.likes ?? 0;
  const safeSemester = paper.semester ?? '-';
  const safeYear = paper.year ?? '-';
  const safeSubject = paper.subject ?? 'General';
  const safeCourse = paper.course ?? '';
  const safeTitle = paper.title ?? 'Untitled Paper';
  const safeDescription = paper.description ?? '';
  const safeCreatedAt = paper.created_at ?? new Date().toISOString();
  const safeTags = paper.tags ?? [];

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast({ type: 'info', message: 'Sign in to like papers' });
      return;
    }
    toggleLike(paper.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast({ type: 'info', message: 'Sign in to bookmark papers' });
      return;
    }
    toggleBookmark(paper.id);
  };

  const subjectColor = getSubjectColor(safeSubject);
  const subjectIcon = getSubjectIcon(safeSubject);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
      >
        <Link to={`/paper/${paper.id}`}>
          <div className="card-bg rounded-2xl border border-themed p-4 sm:p-5 flex items-center gap-4 hover:shadow-lg hover:border-[var(--color-border-hover)] transition-all duration-300 group">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: subjectColor + '15' }}
            >
              {subjectIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-primary truncate group-hover:text-accent transition-colors">
                {safeTitle}
              </h3>
              <div className="flex items-center gap-3 mt-1 text-xs text-tertiary">
                <span>{paper.university ?? 'Unknown'}</span>
                <span>•</span>
                <span>Sem {safeSemester}</span>
                <span>•</span>
                <span>{safeYear}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-tertiary shrink-0">
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> {formatNumber(safeDownloads)}
              </span>
              <span className="flex items-center gap-1">
                <Heart className={`w-3.5 h-3.5 ${paper.is_liked ? 'fill-[var(--color-error)] text-[var(--color-error)]' : ''}`} />
                {formatNumber(safeLikes)}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={handleLike} className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <Heart className={`w-4 h-4 ${paper.is_liked ? 'fill-[var(--color-error)] text-[var(--color-error)]' : 'text-tertiary'}`} />
              </button>
              <button onClick={handleBookmark} className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <Bookmark className={`w-4 h-4 ${paper.is_bookmarked ? 'fill-[var(--color-accent)] text-accent' : 'text-tertiary'}`} />
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/paper/${paper.id}`}>
        <div className="card-bg rounded-2xl border border-themed overflow-hidden hover:shadow-xl hover:border-[var(--color-border-hover)] transition-all duration-300 group h-full flex flex-col">
          {/* Thumbnail / Color bar */}
          <div
            className="h-32 relative flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${subjectColor}20 0%, ${subjectColor}08 100%)` }}
          >
            <div className="text-5xl opacity-60">{subjectIcon}</div>
            {safeCourse && (
              <div className="absolute top-3 left-3">
                <Badge variant="primary" size="sm">{safeCourse}</Badge>
              </div>
            )}
            <div className="absolute top-3 right-3 flex gap-1">
              <button onClick={handleBookmark} className="p-1.5 rounded-lg glass transition-all hover:scale-110">
                <Bookmark className={`w-4 h-4 ${paper.is_bookmarked ? 'fill-[var(--color-accent)] text-accent' : 'text-secondary'}`} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" size="sm">{safeSubject}</Badge>
              <span className="text-xs text-tertiary">Sem {safeSemester}</span>
            </div>

            <h3 className="text-sm font-semibold text-primary line-clamp-2 group-hover:text-accent transition-colors mb-2">
              {safeTitle}
            </h3>

            <p className="text-xs text-tertiary line-clamp-2 mb-4 flex-1">
              {safeDescription}
            </p>

            {/* Uploader */}
            {paper.uploader && (
              <div className="flex items-center gap-2 mb-3">
                <Avatar src={paper.uploader.avatar} name={paper.uploader.name ?? 'User'} size="sm" />
                <div>
                  <p className="text-xs font-medium text-primary">{paper.uploader.name ?? 'Unknown'}</p>
                  <p className="text-xs text-tertiary">{formatRelativeTime(safeCreatedAt)}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-themed">
              <div className="flex items-center gap-3 text-xs text-tertiary">
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  {formatNumber(safeDownloads)}
                </span>
                <button onClick={handleLike} className="flex items-center gap-1 hover:text-[var(--color-error)] transition-colors">
                  <Heart className={`w-3.5 h-3.5 ${paper.is_liked ? 'fill-[var(--color-error)] text-[var(--color-error)]' : ''}`} />
                  {formatNumber(safeLikes)}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-tertiary">
                <Calendar className="w-3 h-3" />
                {safeYear}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ---- Paper Grid ----
interface PaperGridProps {
  papers: Paper[];
  viewMode?: 'grid' | 'list';
  isLoading?: boolean;
}

export function PaperGrid({ papers, viewMode = 'grid', isLoading }: PaperGridProps) {
  if (isLoading) {
    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
        {Array.from({ length: 6 }).map((_, i) => (
          <PaperCardSkeleton key={i} viewMode={viewMode} />
        ))}
      </div>
    );
  }

  if (!papers || papers.length === 0) {
    return (
      <div className="text-center py-20">
        <FileText className="w-16 h-16 text-tertiary mx-auto mb-4 opacity-40" />
        <h3 className="text-lg font-semibold text-primary mb-2">No papers found</h3>
        <p className="text-sm text-secondary">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-3'}>
      {papers.map((paper, index) => (
        <PaperCard key={paper.id} paper={paper} index={index} viewMode={viewMode} />
      ))}
    </div>
  );
}

function PaperCardSkeleton({ viewMode = 'grid' }: { viewMode?: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="card-bg rounded-2xl border border-themed p-5 flex items-center gap-4 animate-pulse">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-tertiary)]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-[var(--color-bg-tertiary)]" />
          <div className="h-3 w-1/3 rounded bg-[var(--color-bg-tertiary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="card-bg rounded-2xl border border-themed overflow-hidden animate-pulse">
      <div className="h-32 bg-[var(--color-bg-tertiary)]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-20 rounded bg-[var(--color-bg-tertiary)]" />
        <div className="h-5 w-full rounded bg-[var(--color-bg-tertiary)]" />
        <div className="h-3 w-4/5 rounded bg-[var(--color-bg-tertiary)]" />
        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)]" />
          <div className="h-3 w-24 rounded bg-[var(--color-bg-tertiary)]" />
        </div>
      </div>
    </div>
  );
}
