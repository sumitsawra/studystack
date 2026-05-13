// ========================================
// Paper Store — Zustand + Supabase (No Mock Data)
// ========================================
import { create } from 'zustand';
import type { Paper, PaperFilters, Comment, Bookmark } from '@/types';
import { PAGE_SIZE } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

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

// Build Supabase query from filters
function buildSupabaseQuery(filters: PaperFilters) {
  let query = supabase
    .from('papers')
    .select('*', { count: 'exact' })
    .eq('status', 'approved');

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
    } catch (err) {
      console.error('fetchPapers error:', err);
      set({ papers: [], isLoading: false });
    }
  },

  fetchMorePapers: async () => {
    const { page, filters, papers } = get();
    set({ isLoading: true });
    try {
      const start = page * PAGE_SIZE;
      const { data, error } = await buildSupabaseQuery(filters).range(start, start + PAGE_SIZE - 1);
      if (error) throw error;
      const newPapers = (data as Paper[]) || [];
      set({
        papers: [...papers, ...newPapers],
        hasMore: newPapers.length === PAGE_SIZE,
        page: page + 1,
        isLoading: false,
      });
    } catch (err) {
      console.error('fetchMorePapers error:', err);
      set({ isLoading: false });
    }
  },

  fetchTrending: async () => {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('status', 'approved')
        .order('downloads', { ascending: false })
        .limit(8);
      if (error) throw error;
      set({ trendingPapers: (data as Paper[]) || [] });
    } catch (err) {
      console.error('fetchTrending error:', err);
      set({ trendingPapers: [] });
    }
  },

  fetchRecent: async () => {
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      set({ recentPapers: (data as Paper[]) || [] });
    } catch (err) {
      console.error('fetchRecent error:', err);
      set({ recentPapers: [] });
    }
  },

  fetchPaperById: async (id: string) => {
    set({ isLoading: true, currentPaper: null, comments: [] });
    try {
      const [{ data: paper, error: paperError }, { data: comments }] = await Promise.all([
        supabase.from('papers').select('*').eq('id', id).single(),
        supabase.from('comments').select('*, user:profiles(*)').eq('paper_id', id).order('created_at', { ascending: false }),
      ]);

      if (paperError) throw paperError;

      set({
        currentPaper: paper as Paper,
        comments: (comments as Comment[]) || [],
        isLoading: false,
      });
    } catch (err) {
      console.error('fetchPaperById error:', err);
      set({ currentPaper: null, isLoading: false });
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
    set((state) => ({
      papers: state.papers.map((p) =>
        p.id === paperId ? { ...p, is_liked: !p.is_liked, likes: (p.likes ?? 0) + (p.is_liked ? -1 : 1) } : p
      ),
      currentPaper: state.currentPaper?.id === paperId
        ? { ...state.currentPaper, is_liked: !state.currentPaper.is_liked, likes: (state.currentPaper.likes ?? 0) + (state.currentPaper.is_liked ? -1 : 1) }
        : state.currentPaper,
      trendingPapers: state.trendingPapers.map((p) =>
        p.id === paperId ? { ...p, is_liked: !p.is_liked, likes: (p.likes ?? 0) + (p.is_liked ? -1 : 1) } : p
      ),
    }));

    const paper = get().currentPaper || get().papers.find(p => p.id === paperId);
    if (paper) {
      await supabase.from('papers').update({ likes: paper.likes }).eq('id', paperId);
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
    } catch (err) {
      console.error('addComment error:', err);
    }
  },

  setViewMode: (mode: 'grid' | 'list') => set({ viewMode: mode }),

  searchPapers: (query: string) => {
    set((state) => ({ filters: { ...state.filters, search: query } }));
    get().fetchPapers();
  },
}));
