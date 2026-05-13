// ========================================
// Card Component
// ========================================
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  className,
  hover = true,
  glass = false,
  onClick,
  padding = 'md',
}: CardProps) {
  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  if (glass) {
    return (
      <motion.div
        whileHover={hover ? { y: -2 } : undefined}
        onClick={onClick}
        className={cn('glass-card', paddings[padding], onClick && 'cursor-pointer', className)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={cn(
        'card-bg rounded-2xl border border-themed shadow-sm',
        'transition-all duration-300',
        hover && 'hover:shadow-lg hover:border-[var(--color-border-hover)]',
        paddings[padding],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
