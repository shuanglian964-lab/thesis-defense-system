import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, ArrowLeft, BookOpen } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { sessionId } = useSession();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-300/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-purple-300/20 blur-[100px] pointer-events-none" />
      <div className="fixed top-[40%] left-[50%] w-[25vw] h-[25vw] rounded-full bg-pink-300/15 blur-[80px] pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBack && (
              <Link to="/" className="p-1.5 rounded-xl hover:bg-white/50 transition-colors text-indigo-400">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-500" />
              <span className="font-semibold text-indigo-700 text-sm sm:text-base">Thesis Defense Simulator</span>
            </Link>
          </div>
          {sessionId && (
            <span className="text-xs text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full">Session active</span>
          )}
          <Link
            to="/history"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/50"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">History</span>
          </Link>
        </div>
      </nav>

      <main className="pt-14">{children}</main>
    </div>
  );
}
