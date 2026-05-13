// ========================================
// Browse Page
// ========================================
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { usePaperStore } from '@/stores/paperStore';
import { PaperGrid } from '@/components/papers/PaperCard';
import { PaperFilters } from '@/components/papers/PaperFilters';
import { Button } from '@/components/ui/Button';
import { useDebounce, useInfiniteScroll } from '@/hooks';

export default function Browse() {
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebounce(localSearch, 400);
  const {
    papers, filters, isLoading, hasMore, viewMode,
    fetchPapers, fetchMorePapers, setFilters, setViewMode, searchPapers,
  } = usePaperStore();

  useEffect(() => {
    const q = searchParams.get('q');
    const subject = searchParams.get('subject');
    const sort = searchParams.get('sort');
    if (q) { setLocalSearch(q); setFilters({ search: q }); }
    if (subject) setFilters({ subject });
    if (sort) setFilters({ sortBy: sort as any });
    if (!q && !subject && !sort) fetchPapers();
  }, []);// eslint-disable-line

  useEffect(() => {
    if (debouncedSearch !== filters.search) searchPapers(debouncedSearch);
  }, [debouncedSearch]);// eslint-disable-line

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) fetchMorePapers();
  }, [isLoading, hasMore, fetchMorePapers]);

  const lastRef = useInfiniteScroll(loadMore, hasMore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">Browse Papers</h1>
        <p className="text-secondary">Discover question papers from universities worldwide</p>
      </motion.div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-tertiary" />
          <input
            type="text" placeholder="Search by title, subject, or keyword..."
            value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm card-bg border border-themed rounded-xl text-primary placeholder:text-tertiary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFiltersOpen(true)}
            className="lg:hidden p-3 rounded-xl border border-themed text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <div className="flex items-center card-bg border border-themed rounded-xl overflow-hidden">
            <button onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'text-accent accent-light-bg' : 'text-tertiary hover:text-primary'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'text-accent accent-light-bg' : 'text-tertiary hover:text-primary'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-8">
        <PaperFilters isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
        <div className="flex-1 min-w-0">
          <PaperGrid papers={papers} viewMode={viewMode} isLoading={isLoading && papers.length === 0} />
          {hasMore && <div ref={lastRef} className="h-20 flex items-center justify-center">
            {isLoading && <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />}
          </div>}
        </div>
      </div>
    </div>
  );
}
