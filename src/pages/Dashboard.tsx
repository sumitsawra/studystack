// ========================================
// User Dashboard Page
// ========================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Heart, Bookmark, FileText, Settings, TrendingUp, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Avatar } from '@/components/ui/Elements';
import { PaperCard } from '@/components/papers/PaperCard';
import { useAuthStore } from '@/stores/authStore';
import { usePaperStore } from '@/stores/paperStore';
import { formatNumber } from '@/lib/utils';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { trendingPapers, fetchTrending } = usePaperStore();
  const [activeTab, setActiveTab] = useState<'uploads' | 'saved' | 'settings'>('uploads');

  useEffect(() => { fetchTrending(); }, [fetchTrending]);

  const stats = [
    { icon: <Upload className="w-5 h-5" />, value: '12', label: 'Uploads', color: 'var(--color-accent)' },
    { icon: <Download className="w-5 h-5" />, value: '2.4K', label: 'Downloads', color: 'var(--color-success)' },
    { icon: <Heart className="w-5 h-5" />, value: '348', label: 'Likes', color: 'var(--color-error)' },
    { icon: <Bookmark className="w-5 h-5" />, value: '56', label: 'Saved', color: 'var(--color-warning)' },
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card padding="md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.icon}</div>
                  <div><p className="text-xl font-bold text-primary">{s.value}</p><p className="text-xs text-tertiary">{s.label}</p></div>
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

        {/* Tab Content */}
        {activeTab === 'uploads' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPapers.slice(0, 6).map((p, i) => (<PaperCard key={p.id} paper={p} index={i} />))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPapers.slice(0, 3).map((p, i) => (<PaperCard key={p.id} paper={p} index={i} />))}
          </div>
        )}

        {activeTab === 'settings' && (
          <Card padding="lg">
            <h2 className="text-lg font-semibold text-primary mb-6">Profile Settings</h2>
            <div className="space-y-5 max-w-md">
              <div><label className="block text-sm font-medium text-secondary mb-1.5">Name</label>
                <input defaultValue={user?.name} className="w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary" /></div>
              <div><label className="block text-sm font-medium text-secondary mb-1.5">University</label>
                <input defaultValue={user?.university || ''} className="w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary" /></div>
              <div><label className="block text-sm font-medium text-secondary mb-1.5">Bio</label>
                <textarea defaultValue={user?.bio || ''} rows={3} className="w-full card-bg border border-themed rounded-xl px-4 py-3 text-sm text-primary resize-none" /></div>
              <Button>Save Changes</Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
