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
    <div className={`min-h-screen ${isHome ? '' : 'bg-[#faf8f5]'}`}>
      {/* Nav */}
      <nav className={`z-50 border-b ${isHome ? 'fixed top-0 left-0 right-0 border-transparent' : 'border-[#e8e1d5]'}`}
        style={isHome ? { background: 'transparent' } : { background: 'rgba(250,248,245,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <Link
                to="/"
                className="p-1.5 rounded-lg hover:bg-[#f5ecd7] transition-colors"
                style={{ color: '#b8860b' }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}
            <Link to="/" className="flex items-center gap-2 no-underline hover:opacity-80 transition-opacity">
              <GraduationCap className="w-5 h-5" style={{ color: '#b8860b' }} />
              <span className="font-semibold text-[#1e293b] text-sm tracking-tight font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                Thesis Defense
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {sessionId && (
              <span className="text-xs px-3 py-1 rounded-full border" style={{ color: '#b8860b', background: '#f5ecd7', borderColor: 'rgba(184,134,11,0.2)' }}>
                Session active
              </span>
            )}
            {history.length > 0 && (
              <Link
                to="/history"
                className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-1.5 transition-colors hover:bg-[#f5ecd7]"
                style={{ color: '#64748b' }}
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
