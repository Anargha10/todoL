import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ToastContainer } from '../common/Toast';
import { useToast } from '@/hooks/useTheme';
import { motion } from 'framer-motion';

export function AppLayout() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent dark:from-primary-900/20" />
      <div className="relative">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-7xl px-4 py-6 sm:py-8"
        >
          <Outlet />
        </motion.main>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
