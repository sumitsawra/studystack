// ========================================
// Register Page
// ========================================
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export default function Register() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, loginAsDemo } = useAuthStore();
  const { addToast } = useUIStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { addToast({ type: 'error', message: 'Password must be at least 6 characters' }); return; }
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      addToast({ type: 'success', message: 'Account created!' });
      navigate('/dashboard');
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Registration failed' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-[#64D2FF] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-bold text-primary">Study<span className="text-accent">Stack</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-primary mb-2">Create your account</h1>
          <p className="text-secondary text-sm">Join thousands of students sharing study materials</p>
        </div>

        <Card padding="lg">
          <button onClick={async () => { try { await signInWithGoogle(); navigate('/dashboard'); } catch {} }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-themed text-sm font-medium text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 my-5"><div className="flex-1 h-px bg-[var(--color-bg-tertiary)]" /><span className="text-xs text-tertiary">or</span><div className="flex-1 h-px bg-[var(--color-bg-tertiary)]" /></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} icon={<User className="w-4 h-4" />} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />} rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} required />
            <Button type="submit" size="lg" isLoading={loading} className="w-full">Create Account</Button>
          </form>
          <button onClick={() => { loginAsDemo(); addToast({ type: 'success', message: 'Welcome!' }); navigate('/dashboard'); }}
            className="w-full mt-3 py-2.5 text-sm text-secondary hover:text-primary transition-colors">Try Demo Mode</button>
        </Card>
        <p className="text-center text-sm text-secondary mt-6">
          Already have an account? <Link to="/login" className="text-accent hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
