// ========================================
// Admin Dashboard Page
// ========================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, AlertTriangle, CheckCircle, XCircle, TrendingUp, BarChart3, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, Avatar } from '@/components/ui/Elements';
import { useUIStore } from '@/stores/uiStore';
import { formatNumber } from '@/lib/utils';

export default function AdminDashboard() {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'users' | 'reports'>('overview');

  const stats = [
    { icon: <Users className="w-5 h-5" />, value: '25,432', label: 'Total Users', trend: '+12%', color: 'var(--color-accent)' },
    { icon: <FileText className="w-5 h-5" />, value: '50,891', label: 'Total Papers', trend: '+8%', color: 'var(--color-success)' },
    { icon: <TrendingUp className="w-5 h-5" />, value: '1.2M', label: 'Downloads', trend: '+23%', color: 'var(--color-warning)' },
    { icon: <AlertTriangle className="w-5 h-5" />, value: '18', label: 'Pending Reports', trend: '-5%', color: 'var(--color-error)' },
  ];

  const pendingPapers = [
    { id: '1', title: 'Physics Quantum Mechanics 2024', user: 'John Doe', date: '2 hours ago' },
    { id: '2', title: 'Advanced Calculus Mid-term 2023', user: 'Jane Smith', date: '5 hours ago' },
    { id: '3', title: 'Chemistry Organic Lab Manual', user: 'Mike Wilson', date: '1 day ago' },
    { id: '4', title: 'CS Data Structures Final 2024', user: 'Sarah Lee', date: '1 day ago' },
  ];

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'approvals' as const, label: 'Approvals', icon: <CheckCircle className="w-4 h-4" /> },
    { key: 'users' as const, label: 'Users', icon: <Users className="w-4 h-4" /> },
    { key: 'reports' as const, label: 'Reports', icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-accent" />
          <div><h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-sm text-secondary">Manage platform content and users</p></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card padding="md">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '15', color: s.color }}>{s.icon}</div>
                  <span className="text-xs font-medium text-[var(--color-success)]">{s.trend}</span>
                </div>
                <p className="text-2xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-tertiary">{s.label}</p>
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

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card padding="lg">
              <h3 className="font-semibold text-primary mb-4">Upload Trends</h3>
              <div className="h-48 flex items-end gap-2">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.05 }}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-[var(--color-accent)] to-[var(--color-accent)]/60 opacity-80 hover:opacity-100 transition-opacity" />
                ))}
              </div>
              <div className="flex justify-between text-xs text-tertiary mt-2">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </Card>
            <Card padding="lg">
              <h3 className="font-semibold text-primary mb-4">Popular Subjects</h3>
              <div className="space-y-3">
                {[
                  { name: 'Computer Science', pct: 85 }, { name: 'Mathematics', pct: 72 },
                  { name: 'Physics', pct: 65 }, { name: 'Chemistry', pct: 48 }, { name: 'Electronics', pct: 35 },
                ].map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary">{s.name}</span><span className="text-tertiary">{s.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#64D2FF]" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Approvals */}
        {activeTab === 'approvals' && (
          <Card padding="none">
            <div className="divide-y divide-themed">
              {pendingPapers.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-[var(--color-bg-tertiary)]/50 transition-colors">
                  <FileText className="w-8 h-8 text-tertiary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{p.title}</p>
                    <p className="text-xs text-tertiary">by {p.user} • {p.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="primary" icon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() => addToast({ type: 'success', message: 'Paper approved!' })}>Approve</Button>
                    <Button size="sm" variant="danger" icon={<XCircle className="w-3.5 h-3.5" />}
                      onClick={() => addToast({ type: 'info', message: 'Paper rejected' })}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <Card padding="none">
            <div className="divide-y divide-themed">
              {['Alex Johnson', 'Priya Sharma', 'James Chen', 'Sarah Miller', 'Raj Patel'].map((name, i) => (
                <div key={name} className="flex items-center gap-4 p-4">
                  <Avatar name={name} src={null} size="md" />
                  <div className="flex-1"><p className="text-sm font-medium text-primary">{name}</p>
                    <p className="text-xs text-tertiary">{name.toLowerCase().replace(' ', '.')}@email.com</p></div>
                  <Badge variant={i === 0 ? 'primary' : 'default'}>{i === 0 ? 'Admin' : 'Student'}</Badge>
                  <Button size="sm" variant="ghost">Manage</Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Reports */}
        {activeTab === 'reports' && (
          <Card padding="none">
            <div className="divide-y divide-themed">
              {[
                { title: 'Broken PDF link', paper: 'Physics 2023', status: 'pending' },
                { title: 'Inappropriate content', paper: 'Random Notes', status: 'pending' },
                { title: 'Duplicate upload', paper: 'Math 2024', status: 'resolved' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <AlertTriangle className={`w-5 h-5 ${r.status === 'pending' ? 'text-[var(--color-warning)]' : 'text-[var(--color-success)]'}`} />
                  <div className="flex-1"><p className="text-sm font-medium text-primary">{r.title}</p>
                    <p className="text-xs text-tertiary">Paper: {r.paper}</p></div>
                  <Badge variant={r.status === 'pending' ? 'warning' : 'success'}>{r.status}</Badge>
                  {r.status === 'pending' && <Button size="sm" variant="secondary">Review</Button>}
                </div>
              ))}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
