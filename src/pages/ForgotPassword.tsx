// ========================================
// Forgot Password Page
// ========================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export default function ForgotPassword() {
  const { resetPassword } = useAuthStore();
  const { addToast } = useUIStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      addToast({ type: 'success', message: 'Reset email sent!' });
    } catch (err: any) {
      addToast({ type: 'error', message: err.message || 'Failed to send reset email' });
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
          <h1 className="text-2xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-secondary text-sm">Enter your email to receive a reset link</p>
        </div>

        <Card padding="lg">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" /></div>
              <h3 className="text-lg font-semibold text-primary mb-2">Check your email</h3>
              <p className="text-sm text-secondary mb-6">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login"><Button variant="secondary" className="w-full">Back to Login</Button></Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />} required />
              <Button type="submit" size="lg" isLoading={loading} className="w-full">Send Reset Link</Button>
            </form>
          )}
        </Card>
        <p className="text-center mt-6">
          <Link to="/login" className="text-sm text-secondary hover:text-primary flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
