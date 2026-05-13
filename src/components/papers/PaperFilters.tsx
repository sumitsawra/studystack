// ========================================
// Paper Filters Sidebar Component
// ========================================
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { usePaperStore } from '@/stores/paperStore';
import { SUBJECTS, SEMESTERS, UNIVERSITIES, COURSES, YEARS, SORT_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

interface PaperFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaperFilters({ isOpen, onClose }: PaperFiltersProps) {
  const { filters, setFilters, resetFilters } = usePaperStore();

  const selectClass =
    'w-full card-bg border border-themed rounded-xl px-3 py-2.5 text-sm text-primary focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer';

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="card-bg rounded-2xl border border-themed p-5 sticky top-24 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-accent hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <FilterFields filters={filters} setFilters={setFilters} selectClass={selectClass} />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] card-bg border-r border-themed p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-primary flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </h3>
                <button onClick={onClose} className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-[var(--color-bg-tertiary)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <FilterFields filters={filters} setFilters={setFilters} selectClass={selectClass} />
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" size="sm" onClick={resetFilters} className="flex-1">
                  Reset
                </Button>
                <Button variant="primary" size="sm" onClick={onClose} className="flex-1">
                  Apply
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterFields({
  filters,
  setFilters,
  selectClass,
}: {
  filters: ReturnType<typeof usePaperStore.getState>['filters'];
  setFilters: ReturnType<typeof usePaperStore.getState>['setFilters'];
  selectClass: string;
}) {
  return (
    <>
      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Sort By</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ sortBy: e.target.value as any })}
          className={selectClass}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Subject</label>
        <select
          value={filters.subject}
          onChange={(e) => setFilters({ subject: e.target.value })}
          className={selectClass}
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Semester</label>
        <select
          value={filters.semester ?? ''}
          onChange={(e) => setFilters({ semester: e.target.value ? Number(e.target.value) : null })}
          className={selectClass}
        >
          <option value="">All Semesters</option>
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
      </div>

      {/* University */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">University</label>
        <select
          value={filters.university}
          onChange={(e) => setFilters({ university: e.target.value })}
          className={selectClass}
        >
          <option value="">All Universities</option>
          {UNIVERSITIES.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* Course */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Course</label>
        <select
          value={filters.course}
          onChange={(e) => setFilters({ course: e.target.value })}
          className={selectClass}
        >
          <option value="">All Courses</option>
          {COURSES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-xs font-medium text-secondary mb-1.5">Year</label>
        <select
          value={filters.year ?? ''}
          onChange={(e) => setFilters({ year: e.target.value ? Number(e.target.value) : null })}
          className={selectClass}
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </>
  );
}
