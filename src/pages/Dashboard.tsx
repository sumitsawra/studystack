// ========================================
// User Dashboard Page
// ========================================
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Heart, Bookmark, FileText, Settings } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Avatar } from '@/components/ui/Elements';
import { PaperCard } from '@/components/papers/PaperCard';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { formatNumber } from '@/lib/utils';
import type { Paper } from '@/types';

export default function Dashboard() {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'uploads' | 'saved' | 'settings'>('uploads');
  const [myPapers, setMyPapers] = useState<Paper[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Real stats
  const [stats, setStats] = useState({
    uploads: 0,
    downloads: 0,
    likes: 0,
    saved: 0,
  });

  // Settings form
  const [form, setForm] = useState({
    name: user?.name || '',
    university: user?.university || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    if (user?.id) {
      fetchMyPapers();
      fetchStats();
    }
  }, [user?.id]);

  const fetchMyPapers = async () => {
    setIsLoadingPapers(true);
    try {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('uploader_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyPapers((data as Paper[]) || []);
    } catch (err) {
      console.error('fetchMyPapers error:', err);
    } finally {
      setIsLoadingPapers(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get user's papers
      const { data: papers } = await supabase
        .from('papers')
        .select('downloads, likes')
        .eq('uploader_id', user!.id);

      const totalUploads = papers?.length || 0;
      const totalDownloads = papers?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0;
      const totalLikes = papers?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0;

      setStats({
        uploads: totalUploads,
        downloads: totalDownloads,
        likes: totalLikes,
        saved: 0, // bookmarks not tracked yet
      });
    } catch (err) {
      console.error('fetchStats error:', err);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: form.name,
        university: form.university,
        bio: form.bio,
      });
    } catch (err) {
      console.error('updateProfile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const statCards = [
    { icon: <Upload className="w-5 h-5" />, value: formatNumber(stats.uploads), label: 'Uploads', color: 'var(--color-accent)' },
    { icon: <Download className="w-5 h-5" />, value: formatNumber(stats.downloads), label: 'Downloads', color: 'var(--color-success)' },
    { icon: <Heart className="w-5 h-5" />, value: formatNumber(stats.likes), label: 'Likes', color: 'var(--color-error)' },
    { icon: <Bookmark className="w-5 h-5" />, value: formatNumber(stats.saved), label: 'Saved', color: 'var(--color-warning)' },
  ];

  const tabs = [
    { key: 'uploads' as const, label: 'My Uploads', icon: <FileText className="w-4 h-4" /> },
    { key: 'saved' as const, label: 'Saved Papers', icon: <Bookmark className="w-4 h-4" /> },
    { key: 'settings' as const, label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <Avatar name={user?.name || 'User'} src={user?.avatar || null} size="xl" />
          <div>
            <h1 className="text-2xl font-bold text-primary">{user?.name}</h1>
            <p className="text-secondary">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="primary">{user?.role || 'student'}</Badge>
              {user?.university && <span className="text-sm text-tertiary">{user.university}</span>}
            </div>
          </div>
        </div>

        {/* Real Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '15', color: s.color }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-primary">{s.value}</p>
                    <p className="text-xs text-tertiary">{s.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 card-bg rounded-xl border border-themed p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? 'bg-accent text-white' : 'text-secondary hover:text-primary'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* My Uploads — real papers */}
        {activeTab === 'uploads' && (
          <>
            {isLoadingPapers ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-bg rounded-2xl border border-themed overflow-hidden animate-pulse">
                    <div className="h-32 bg-[var(--color-bg-tertiary)]" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 w-20 rounded bg-[var(--color-bg-tertiary)]" />
                      <div className="h-5 w-full rounded bg-[var(--color-bg-tertiary)]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : myPapers.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-tertiary mx-auto mb-4 opacity-40" />
                <h3 className="text-lg font-semibold text-primary mb-2">No uploads yet</h3>
                <p className="text-sm text-secondary mb-6">Share your first paper with the community!</p>
                <Button onClick={() => window.location.href = '/upload'}>Upload a Paper</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPapers.map((p, i) => (<PaperCard key={p.id} paper={p} index={i} />))}
              </div>
            )}
          </>
        )}

        {/* Saved Papers */}
        {activeTab === 'saved' && (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 text-tertiary mx-auto mb-4 opacity-40" />
            <h3 className="text-lg font-semibold text-primary mb-2">No saved papers yet</h3>
            <p className="text-sm text-secondary mb-6">Bookmark papers you want to read later</p>
            <Button onClick={() => window.location.href = '/browse'}>Browse Papers</Button>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-primary mb-6">Profile Settings</h2>
            <div className="space-y-5 max-w-md">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">University</label>
                <input
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                  className="w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary resize-none"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        )}

      </motion.div>
    </div>
  );
}
