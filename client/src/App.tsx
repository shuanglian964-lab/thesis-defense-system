import { type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { SessionProvider } from './context/SessionContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PreparationPage from './pages/PreparationPage';
import DefensePage from './pages/DefensePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import ComparisonPage from './pages/ComparisonPage';

function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageShell><HomePage /></PageShell>} />
        <Route path="/prepare" element={<PageShell><PreparationPage /></PageShell>} />
        <Route path="/defense" element={<PageShell><DefensePage /></PageShell>} />
        <Route path="/results" element={<PageShell><ResultsPage /></PageShell>} />
        <Route path="/results/:historyId" element={<PageShell><ResultsPage /></PageShell>} />
        <Route path="/history" element={<PageShell><HistoryPage /></PageShell>} />
        <Route path="/compare" element={<PageShell><ComparisonPage /></PageShell>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </SessionProvider>
  );
}
