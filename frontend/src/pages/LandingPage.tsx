import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, BarChart3, CheckSquare } from 'lucide-react';
import { Button } from '../components/common/Button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/40 via-transparent to-transparent dark:from-primary-900/20" />
      
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">TaskFlow</span>
        </div>
        <Link to="/dashboard">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Get Started
          </Button>
        </Link>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Task Management,{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            A production-quality task management platform built for modern teams. 
            Track, analyze, and complete tasks with beautiful analytics and seamless workflows.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20 grid gap-6 sm:grid-cols-3"
        >
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Optimistic UI updates with instant feedback and background sync.' },
            { icon: BarChart3, title: 'Rich Analytics', desc: 'Visual dashboards with priority charts, status breakdowns, and activity feeds.' },
            { icon: Shield, title: 'Production Ready', desc: 'Built with TypeScript, tested patterns, and scalable architecture.' },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary-50 p-3 dark:bg-primary-950/30">
                <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
