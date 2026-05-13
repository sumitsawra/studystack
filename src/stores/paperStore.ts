// ========================================
// Paper Store — Zustand + Supabase
// ========================================
import { create } from 'zustand';
import type { Paper, PaperFilters, Comment, Bookmark } from '@/types';
import { generateMockPapers } from '@/lib/utils';
import { PAGE_SIZE } from '@/lib/constants';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface PaperState {
  papers: Paper[];
  trendingPapers: Paper[];
  recentPapers: Paper[];
  currentPaper: Paper | null;
  comments: Comment[];
  bookmarks: Bookmark[];
  filters: PaperFilters;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  viewMode: 'grid' | 'list';

  fetchPapers: () => Promise<void>;
  fetchMorePapers: () => Promise<void>;
  fetchTrending: () => Promise<void>;
  fetchRecent: () => Promise<void>;
  fetchPaperById: (id: string) => Promise<void>;
  setFilters: (filters: Partial<PaperFilters>) => void;
  resetFilters: () => void;
  toggleLike: (paperId: string) => void;
  toggleBookmark: (paperId: string) => void;
  addComment: (paperId: string, content: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  searchPapers: (query: string) => void;
}

const defaultFilters: PaperFilters = {
  search: '',
  subject: '',
  semester: null,
  university: '',
  year: null,
  course: '',
  sortBy: 'newest',
};

// Mock data fallback (used when Supabase is not configured or has no data yet)
const allMockPapers = generateMockPapers(60);

function filterMockPapers(papers: Paper[], filters: PaperFilters): Paper[] {
  let result = [...papers];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (filters.subject) result = result.filter((p) => p.subject === filters.subject);
  if (filters.semester) result = result.filter((p) => p.semester === filters.semester);
  if (filters.university) result = result.filter((p) => p.university === filters.university);
  if (filters.year) result = result.filter((p) => p.year === filters.year);
  if (filters.course) result = result.filter((p) => p.course === filters.course);

  switch (filters.sortBy) {
    case 'newest':
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case 'most_downloaded':
      result.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'most_liked':
      result.sort((a, b) => b.likes - a.likes);
      break;
    case 'trending':
      result.sort((a, b) => (b.downloads + b.likes * 3) - (a.downloads + a.likes * 3));
      break;
  }
  return result;
}

// Build Supabase query from filters
function buildSupabaseQuery(filters: PaperFilters) {
  let query = supabase.from('papers').select('*', { count: 'exact' });

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,subject.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }
  if (filters.subject) query = query.eq('subject', filters.subject);
  if (filters.semester) query = query.eq('semester', filters.semester);
  if (filters.university) query = query.eq('university', filters.university);
  if (filters.year) query = query.eq('year', filters.year);
  if (filters.course) query = query.eq('course', filters.course);

  switch (filters.sortBy) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'most_downloaded':
      query = query.order('downloads', { ascending: false });
      break;
    case 'most_liked':
      query = query.order('likes', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  return query;
}

export const usePaperStore = create<PaperState>((set, get) => ({
  papers: [],
  trendingPapers: [],
  recentPapers: [],
  currentPaper: null,
  comments: [],
  bookmarks: [],
  filters: defaultFilters,
  isLoading: false,
  hasMore: true,
  page: 0,
  viewMode: 'grid',

  fetchPapers: async () => {
    set({ isLoading: true, page: 0 });

    if (!isSupabaseConfigured()) {
      // Fallback to mock data
      await new Promise((r) => setTimeout(r, 400));
      const { filters } = get();
      const filtered = filterMockPapers(allMockPapers, filters);
      set({ papers: filtered.slice(0, PAGE_SIZE), hasMore: filtered.length > PAGE_SIZE, page: 1, isLoading: false });
      return;
    }

    try {
      const { filters } = get();
      const { data, count, error } = await buildSupabaseQuery(filters).range(0, PAGE_SIZE - 1);
      if (error) throw error;
      set({
        papers: (data as Paper[]) || [],
        hasMore: (count || 0) > PAGE_SIZE,
        page: 1,
        isLoading: false,
      });
    } catch {
      // Fallback to mock on error
      const { filters } = get();
      const filtered = filterMockPapers(allMockPapers, filters);
      set({ papers: filtered.slice(0, PAGE_SIZE), hasMore: filtered.length > PAGE_SIZE, page: 1, isLoading: false });
    }
  },

  fetchMorePapers: async () => {
    const { page, filters, papers } = get();
    set({ isLoading: true });

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 300));
      const filtered = filterMockPapers(allMockPapers, filters);
      const start = page * PAGE_SIZE;
      const newPapers = filtered.slice(start, start + PAGE_SIZE);
      set({ papers: [...papers, ...newPapers], hasMore: start + PAGE_SIZE < filtered.length, page: page + 1, isLoading: false });
      return;
    }

    try {
      const start = page * PAGE_SIZE;
      const { data, error } = await buildSupabaseQuery(filters).range(start, start + PAGE_SIZE - 1);
      if (error) throw error;
      const newPapers = (data as Paper[]) || [];
      set({ papers: [...papers, ...newPapers], hasMore: newPapers.length === PAGE_SIZE, page: page + 1, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchTrending: async () => {
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 300));
      const trending = [...allMockPapers]
        .sort((a, b) => (b.downloads + b.likes * 3) - (a.downloads + a.likes * 3))
        .slice(0, 8);
      set({ trendingPapers: trending });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .order('downloads', { ascending: false })
        .limit(8);
      if (error) throw error;
      set({ trendingPapers: (data as Paper[]) || [] });
    } catch {
      const trending = [...allMockPapers]
        .sort((a, b) => (b.downloads + b.likes * 3) - (a.downloads + a.likes * 3))
        .slice(0, 8);
      set({ trendingPapers: trending });
    }
  },

  fetchRecent: async () => {
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 300));
      const recent = [...allMockPapers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);
      set({ recentPapers: recent });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      set({ recentPapers: (data as Paper[]) || [] });
    } catch {
      const recent = [...allMockPapers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);
      set({ recentPapers: recent });
    }
  },

  fetchPaperById: async (id: string) => {
    set({ isLoading: true });

    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 300));
      const paper = allMockPapers.find((p) => p.id === id) || allMockPapers[0]!;
      set({ currentPaper: paper, comments: [], isLoading: false });
      return;
    }

    try {
      const [{ data: paper, error: paperError }, { data: comments, error: commentsError }] = await Promise.all([
        supabase.from('papers').select('*').eq('id', id).single(),
        supabase.from('comments').select('*, user:profiles(*)').eq('paper_id', id).order('created_at', { ascending: false }),
      ]);

      if (paperError) throw paperError;
      set({
        currentPaper: paper as Paper,
        comments: (comments as Comment[]) || [],
        isLoading: false,
      });
    } catch {
      const paper = allMockPapers.find((p) => p.id === id) || allMockPapers[0]!;
      set({ currentPaper: paper, comments: [], isLoading: false });
    }
  },

  setFilters: (newFilters: Partial<PaperFilters>) => {
    set((state) => ({ filters: { ...state.filters, ...newFilters } }));
    get().fetchPapers();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().fetchPapers();
  },

  toggleLike: async (paperId: string) => {
    // Optimistic update first
    set((state) => ({
      papers: state.papers.map((p) =>
        p.id === paperId ? { ...p, is_liked: !p.is_liked, likes: p.is_liked ? p.likes - 1 : p.likes + 1 } : p
      ),
      currentPaper: state.currentPaper?.id === paperId
        ? { ...state.currentPaper, is_liked: !state.currentPaper.is_liked, likes: state.currentPaper.is_liked ? state.currentPaper.likes - 1 : state.currentPaper.likes + 1 }
        : state.currentPaper,
      trendingPapers: state.trendingPapers.map((p) =>
        p.id === paperId ? { ...p, is_liked: !p.is_liked, likes: p.is_liked ? p.likes - 1 : p.likes + 1 } : p
      ),
    }));

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      const paper = get().papers.find(p => p.id === paperId) || get().currentPaper;
      if (paper) {
        await supabase.from('papers').update({ likes: paper.likes }).eq('id', paperId);
      }
    }
  },

  toggleBookmark: (paperId: string) => {
    set((state) => ({
      papers: state.papers.map((p) =>
        p.id === paperId ? { ...p, is_bookmarked: !p.is_bookmarked } : p
      ),
      currentPaper: state.currentPaper?.id === paperId
        ? { ...state.currentPaper, is_bookmarked: !state.currentPaper.is_bookmarked }
        : state.currentPaper,
    }));
  },

  addComment: async (paperId: string, content: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('comments')
          .insert({ paper_id: paperId, user_id: user.id, content })
          .select('*, user:profiles(*)')
          .single();

        if (error) throw error;
        set((state) => ({ comments: [data as Comment, ...state.comments] }));
        return;
      } catch {
        // fall through to local
      }
    }

    // Local fallback
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      user_id: 'user-demo',
      paper_id: paperId,
      content,
      user: { id: 'user-demo', name: 'Demo User', email: 'demo@studystack.com', avatar: null, role: 'student', university: 'MIT', bio: null, created_at: new Date().toISOString() },
      created_at: new Date().toISOString(),
    };
    set((state) => ({ comments: [newComment, ...state.comments] }));
  },

  setViewMode: (mode: 'grid' | 'list') => set({ viewMode: mode }),

  searchPapers: (query: string) => {
    set((state) => ({ filters: { ...state.filters, search: query } }));
    get().fetchPapers();
  },
}));
