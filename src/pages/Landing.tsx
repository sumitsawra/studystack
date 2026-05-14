// ========================================
// Landing Page
// ========================================
import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Search, ArrowRight, Download, Users, FileText, Star,
  Sparkles, TrendingUp, BookOpen, Zap, Shield, Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, Avatar } from '@/components/ui/Elements';
import { PaperCard } from '@/components/papers/PaperCard';
import { usePaperStore } from '@/stores/paperStore';
import { formatNumber, getSubjectIcon } from '@/lib/utils';
import { SUBJECTS } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { trendingPapers, recentPapers, fetchTrending, fetchRecent } = usePaperStore();

  useEffect(() => {
    fetchTrending();
    fetchRecent();
  }, [fetchTrending, fetchRecent]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#64D2FF]/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge variant="primary" size="md" className="mb-6 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Study Platform
            </Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-primary leading-tight tracking-tight mb-6">
            Your study materials,<br /><span className="text-gradient">all in one place.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Find, preview, and download previous year question papers, notes, and study materials. Built for students, by students.
          </motion.p>
          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
            <input type="text" placeholder="Search papers, notes, subjects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-36 py-4.5 text-base card-bg border border-themed rounded-2xl shadow-lg text-primary placeholder:text-tertiary" />
            <Button type="submit" size="md" className="absolute right-2 top-1/2 -translate-y-1/2">
              Search <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.form>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-tertiary">Popular:</span>
            {['Mathematics', 'Physics', 'Computer Science'].map((tag) => (
              <Link key={tag} to={`/browse?subject=${encodeURIComponent(tag)}`}
                className="px-3 py-1 text-xs rounded-lg border border-themed text-secondary hover:text-primary transition-colors">{tag}</Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <StatsSection />

      {/* TRENDING */}
      {trendingPapers.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5 text-accent" /><span className="text-sm font-medium text-accent">Trending</span></div>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Most Popular Papers</h2>
              </div>
              <Link to="/browse?sort=trending"><Button variant="secondary" size="sm">View All <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingPapers.slice(0, 4).map((paper, i) => (<PaperCard key={paper.id} paper={paper} index={i} />))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES */}
      <CategoriesSection />

      {/* FEATURES */}
      <FeaturesSection />

      {/* RECENT */}
      {recentPapers.length > 0 && (
        <section className="py-20 px-4 bg-[var(--color-bg-tertiary)]/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Recently Uploaded</h2>
                <p className="text-secondary mt-2">Fresh papers from the community</p>
              </div>
              <Link to="/browse?sort=newest"><Button variant="secondary" size="sm">View All <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentPapers.slice(0, 4).map((paper, i) => (<PaperCard key={paper.id} paper={paper} index={i} />))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <TestimonialsSection />

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)]/10 to-[#64D2FF]/10 rounded-3xl blur-xl" />
          <div className="relative card-bg rounded-3xl border border-themed p-12 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Ready to ace your exams?</h2>
            <p className="text-secondary max-w-xl mx-auto mb-8">Join thousands of students using StudyStack to prepare smarter.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register"><Button size="lg">Get Started Free <ArrowRight className="w-5 h-5" /></Button></Link>
              <Link to="/browse"><Button variant="secondary" size="lg">Browse Papers</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [stats, setStats] = useState([
    { icon: <FileText className="w-6 h-6" />, value: '...', label: 'Question Papers' },
    { icon: <Users className="w-6 h-6" />, value: '...', label: 'Active Students' },
    { icon: <Download className="w-6 h-6" />, value: '...', label: 'Downloads' },
    { icon: <Star className="w-6 h-6" />, value: '4.9', label: 'Average Rating' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [{ count: papersCount }, { count: usersCount }, { data: downloadsData }] = await Promise.all([
          supabase.from('papers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('papers').select('downloads').eq('status', 'approved'),
        ]);

        const totalDownloads = downloadsData?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0;

        setStats([
          { icon: <FileText className="w-6 h-6" />, value: formatNumber(papersCount || 0), label: 'Question Papers' },
          { icon: <Users className="w-6 h-6" />, value: formatNumber(usersCount || 0), label: 'Active Students' },
          { icon: <Download className="w-6 h-6" />, value: formatNumber(totalDownloads), label: 'Downloads' },
          { icon: <Star className="w-6 h-6" />, value: '4.9', label: 'Average Rating' },
        ]);
      } catch {
        // keep default values on error
      }
    };
    fetchStats();
  }, []);

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }} className="text-center">
            <div className="w-14 h-14 rounded-2xl accent-light-bg text-accent flex items-center justify-center mx-auto mb-4">{s.icon}</div>
            <p className="text-3xl font-bold text-primary mb-1">{s.value}</p>
            <p className="text-sm text-secondary">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CategoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [categories, setCategories] = useState(
    SUBJECTS.slice(0, 12).map((name) => ({ name, icon: getSubjectIcon(name), count: 0 }))
  );

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('papers')
          .select('subject')
          .eq('status', 'approved');

        if (error || !data) return;

        // Count papers per subject
        const counts: Record<string, number> = {};
        data.forEach((p) => {
          if (p.subject) counts[p.subject] = (counts[p.subject] || 0) + 1;
        });

        setCategories(
          SUBJECTS.slice(0, 12).map((name) => ({
            name,
            icon: getSubjectIcon(name),
            count: counts[name] || 0,
          }))
        );
      } catch {
        // keep 0 counts on error
      }
    };
    fetchCounts();
  }, []);

  return (
    <section ref={ref} className="py-20 px-4 bg-[var(--color-bg-tertiary)]/30">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Browse by Subject</h2>
          <p className="text-secondary max-w-xl mx-auto">Explore papers across all major subjects</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.05 }}>
              <Link to={`/browse?subject=${encodeURIComponent(c.name)}`}>
                <Card className="text-center hover:shadow-lg group" padding="md">
                  <div className="text-3xl mb-3">{c.icon}</div>
                  <h3 className="text-sm font-medium text-primary group-hover:text-accent transition-colors mb-1 truncate">{c.name}</h3>
                  <p className="text-xs text-tertiary">{c.count > 0 ? `${formatNumber(c.count)} papers` : 'No papers yet'}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'AI-Powered Search', desc: 'Smart search that understands what you need.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Instant Preview', desc: 'Preview PDFs directly in your browser.' },
    { icon: <Shield className="w-6 h-6" />, title: 'Verified Content', desc: 'Uploads are reviewed and verified by moderators.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Multi-University', desc: 'Papers from hundreds of universities worldwide.' },
    { icon: <BookOpen className="w-6 h-6" />, title: 'Study Notes', desc: 'Access handwritten and typed study notes too.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Smart Recommendations', desc: 'AI suggests papers based on your study history.' },
  ];
  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Everything you need to <span className="text-gradient">ace your exams</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}>
              <Card className="h-full" padding="lg">
                <div className="w-12 h-12 rounded-2xl accent-light-bg text-accent flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const testimonials = [
    { name: 'Priya Sharma', uni: 'IIT Delhi', text: 'StudyStack saved me during finals. Found every paper I needed!' },
    { name: 'Alex Johnson', uni: 'MIT', text: 'The AI search is incredible. It actually understands what I\'m looking for.' },
    { name: 'Sarah Chen', uni: 'Stanford', text: 'I love the PDF preview feature. No more downloading to check papers.' },
  ];
  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Loved by Students</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}>
              <Card className="h-full" padding="lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (<Star key={j} className="w-4 h-4 fill-[var(--color-warning)] text-[var(--color-warning)]" />))}
                </div>
                <p className="text-sm text-secondary leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} src={null} size="md" />
                  <div>
                    <p className="text-sm font-medium text-primary">{t.name}</p>
                    <p className="text-xs text-tertiary">{t.uni}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
