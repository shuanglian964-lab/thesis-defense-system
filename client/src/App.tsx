import { Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PreparationPage from './pages/PreparationPage';
import DefensePage from './pages/DefensePage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <SessionProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prepare" element={<PreparationPage />} />
          <Route path="/defense" element={<DefensePage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </Layout>
    </SessionProvider>
  );
}
