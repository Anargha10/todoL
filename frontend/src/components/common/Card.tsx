import { ReactNode } from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'rounded-2xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-xl',
        'dark:border-slate-700/50 dark:bg-slate-900/80',
        'shadow-sm shadow-slate-200/50 dark:shadow-none',
        hover && 'cursor-pointer transition-shadow hover:shadow-lg hover:shadow-slate-200/30 dark:hover:shadow-primary-500/5',
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
