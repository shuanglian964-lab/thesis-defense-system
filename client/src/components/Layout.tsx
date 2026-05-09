import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, ArrowLeft, BookOpen } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { sessionId, history } = useSession();
  const location = useLocation();
  const showBack = location.pathname !== '/';
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav
        className={`z-50 ${
          isHome
            ? 'fixed top-0 left-0 right-0 border-transparent bg-transparent'
            : 'sticky top-0 border-b border-neutral-200 bg-surface/85 backdrop-blur-lg'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <Link
                to="/"
                className="p-1.5 rounded-lg hover:bg-accent-50 transition-colors text-accent"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <Link
              to="/"
              className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity"
            >
              <GraduationCap className="w-5 h-5 text-accent" />
              <span className="font-heading font-semibold text-neutral-900 text-sm tracking-tight">
                Thesis Defense
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {sessionId && (
              <span className="text-xs px-3 py-1 rounded-full border border-accent/20 bg-accent-50 text-accent-600">
                Session active
              </span>
            )}
            {history.length > 0 && (
              <Link
                to="/history"
                className="btn-ghost text-xs gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">History</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className={isHome ? '' : 'pt-14'}>{children}</main>
    </div>
  );
}
