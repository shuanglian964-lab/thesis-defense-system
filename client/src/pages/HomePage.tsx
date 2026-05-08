import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSession } from '../context/SessionContext';
import { useApi } from '../hooks/useApi';
import { analyzePaper } from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const { setAnalysis, setStatus, setError, error } = useSession();
  const { loading, execute } = useApi(analyzePaper);

  const handleFileSelected = async (file: File) => {
    setStatus('uploading');
    setError(null);
    const result = await execute(file);
    if (result) {
      setAnalysis(result.session_id, result.paper_analysis, result.questions, result.presentation_outline);
      navigate('/prepare');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-900 tracking-tight">
          English Thesis Defense
          <br />
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Simulation System
          </span>
        </h1>
        <p className="mt-4 text-indigo-500 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
          Upload your English thesis PDF, get AI-generated defense questions, and practice your oral defense with real-time voice feedback.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner
          message="Analyzing your paper..."
          submessage="Extracting text and generating questions · this may take up to 30 seconds"
        />
      ) : (
        <FileUpload onFileSelected={handleFileSelected} isLoading={loading} error={error} />
      )}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[
          { step: '1', title: 'Upload PDF', desc: 'Upload your English thesis' },
          { step: '2', title: 'Review Questions', desc: 'Get 7 AI-generated questions + outline' },
          { step: '3', title: 'Voice Defense', desc: 'Practice with real-time AI feedback' },
        ].map((item) => (
          <div
            key={item.step}
            className="rounded-2xl bg-white/40 backdrop-blur-sm border border-white/40 p-4 text-center"
          >
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-xs font-bold text-indigo-500 flex items-center justify-center mx-auto mb-2">
              {item.step}
            </span>
            <p className="text-sm font-semibold text-indigo-700">{item.title}</p>
            <p className="text-xs text-indigo-400 mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
