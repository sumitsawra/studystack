// ========================================
// Badge, Avatar, Skeleton, Toast Components
// ========================================
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getInitials } from '@/lib/utils';
import { useUIStore } from '@/stores/uiStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// ---- Badge ----
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[var(--color-bg-tertiary)] text-secondary',
    primary: 'accent-light-bg text-accent',
    success: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    error: 'bg-[var(--color-error)]/10 text-[var(--color-error)]',
  };

  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-lg',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// ---- Avatar ----
interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold',
        'bg-gradient-to-br from-[var(--color-accent)] to-[#64D2FF] text-white',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

// ---- Skeleton ----
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variantClass: Record<string, string> = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'bg-[var(--color-bg-tertiary)] animate-pulse',
        variantClass[variant],
        className
      )}
    />
  );
}

export function PaperCardSkeleton() {
  return (
    <div className="card-bg rounded-2xl border border-themed p-6 space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-5 w-3/4" variant="text" />
      <Skeleton className="h-4 w-1/2" variant="text" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>
      <div className="flex justify-between pt-2">
        <Skeleton className="h-4 w-20" variant="text" />
        <Skeleton className="h-4 w-16" variant="text" />
      </div>
    </div>
  );
}

// ---- Toast ----
const toastIcons = {
  success: <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />,
  error: <AlertCircle className="w-5 h-5 text-[var(--color-error)]" />,
  info: <Info className="w-5 h-5 text-[var(--color-info)]" />,
  warning: <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />,
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="card-bg rounded-xl border border-themed shadow-lg px-4 py-3 flex items-center gap-3 min-w-[300px]"
          >
            {toastIcons[toast.type]}
            <p className="text-sm text-primary flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-tertiary hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
