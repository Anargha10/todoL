import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-6 text-8xl font-black text-slate-200 dark:text-slate-800">404</div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mb-8 text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="h-4 w-4" />}>
              Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
