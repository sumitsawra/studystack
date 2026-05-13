// ========================================
// Auth Store — Zustand
// ========================================
import { create } from 'zustand';
import type { Profile } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { generateMockProfile } from '@/lib/utils';

interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  loginAsDemo: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isDemo: false,

  initialize: async () => {
    if (!isSupabaseConfigured()) {
      set({ isLoading: false, isDemo: true });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          user: profile || {
            id: session.user.id,
            name: session.user.user_metadata?.['full_name'] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.['avatar_url'] || null,
            role: 'student',
            university: null,
            bio: null,
            created_at: session.user.created_at,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({
            user: profile || {
              id: session.user.id,
              name: session.user.user_metadata?.['full_name'] || 'User',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.['avatar_url'] || null,
              role: 'student',
              university: null,
              bio: null,
              created_at: session.user.created_at,
            },
            isAuthenticated: true,
          });
        } else {
          set({ user: null, isAuthenticated: false });
        }
      });
    } catch {
      set({ isLoading: false });
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    const { isDemo } = get();
    if (isDemo) {
      const profile = generateMockProfile();
      profile.email = email;
      set({ user: profile, isAuthenticated: true });
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  },

  signUpWithEmail: async (email: string, password: string, name: string) => {
    const { isDemo } = get();
    if (isDemo) {
      const profile = generateMockProfile();
      profile.email = email;
      profile.name = name;
      set({ user: profile, isAuthenticated: true });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
  },

  signInWithGoogle: async () => {
    const { isDemo } = get();
    if (isDemo) {
      const profile = generateMockProfile();
      set({ user: profile, isAuthenticated: true });
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  },

  signOut: async () => {
    const { isDemo } = get();
    if (!isDemo) {
      await supabase.auth.signOut();
    }
    set({ user: null, isAuthenticated: false });
  },

  resetPassword: async (email: string) => {
    const { isDemo } = get();
    if (isDemo) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user, isDemo } = get();
    if (!user) return;

    if (isDemo) {
      set({ user: { ...user, ...updates } });
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
    set({ user: { ...user, ...updates } });
  },

  loginAsDemo: () => {
    const profile = generateMockProfile();
    set({ user: profile, isAuthenticated: true, isDemo: true });
  },
}));
