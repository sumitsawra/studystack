// ========================================
// Not Found Page
// ========================================
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-primary mb-3">Page not found</h1>
        <p className="text-secondary mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/"><Button icon={<Home className="w-4 h-4" />}>Go Home</Button></Link>
          <Link to="/browse"><Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>Browse Papers</Button></Link>
        </div>
      </motion.div>
    </div>
  );
}
