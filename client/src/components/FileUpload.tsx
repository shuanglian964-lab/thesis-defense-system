import { useState, useRef, useCallback, type DragEvent } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface Props {
  onFileSelected: (file: File) => void;
  isLoading: boolean;
  error: string | null;
}

export default function FileUpload({ onFileSelected, isLoading, error }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      if (f.type !== 'application/pdf') return;
      setFile(f);
      onFileSelected(f);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleChange = useCallback(() => {
    const f = inputRef.current?.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  return (
    <div className="w-full max-w-lg">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={[
          'relative p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300',
          isDragging
            ? 'scale-[1.02] shadow-md'
            : 'hover:shadow-sm hover:-translate-y-0.5',
          isLoading ? 'pointer-events-none opacity-50' : '',
        ].join(' ')}
        style={{
          background: isDragging ? 'rgba(245,236,215,0.5)' : 'rgba(255,255,255,0.4)',
          borderColor: isDragging ? '#b8860b' : '#d0c5a5',
          boxShadow: isDragging ? '0 4px 24px rgba(184,134,11,0.1)' : undefined,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex items-center gap-5">
          {file ? (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#f5ecd7' }}
            >
              <FileText className="w-6 h-6" style={{ color: '#b8860b' }} />
            </div>
          ) : (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors"
              style={{ background: isDragging ? '#f5ecd7' : '#fdfcfa', border: '1px solid #e8e1d5' }}
            >
              <Upload className="w-6 h-6" style={{ color: isDragging ? '#b8860b' : '#94a3b8' }} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {file ? (
              <>
                <p className="text-sm font-semibold truncate" style={{ color: '#1e293b' }}>{file.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{(file.size / 1024 / 1024).toFixed(1)} MB · Click to change</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>
                  Drop your English thesis PDF
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>
                  or click to browse · PDF only · Max 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 p-4 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(254,242,242,0.6)', border: '1px solid rgba(239,68,68,0.15)' }}
        >
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}
    </div>
  );
}
