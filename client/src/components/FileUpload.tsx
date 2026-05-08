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
      if (f.type !== 'application/pdf') {
        return;
      }
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

  const handleChange = useCallback(
    () => {
      const f = inputRef.current?.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`
          relative p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300
          bg-white/50 backdrop-blur-xl
          ${isDragging
            ? 'border-indigo-400 bg-indigo-50/60 scale-[1.02] shadow-lg shadow-indigo-200/30'
            : 'border-white/60 hover:border-indigo-300 hover:bg-white/60 hover:shadow-md'}
          ${isLoading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4 text-center">
          {file ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-indigo-500" />
              </div>
              <div>
                <p className="font-semibold text-indigo-700">{file.name}</p>
                <p className="text-sm text-indigo-400">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <Upload className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold text-indigo-600">Drop your English thesis PDF here</p>
                <p className="text-sm text-indigo-400 mt-1">or click to browse · Max 10MB</p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-red-50/70 backdrop-blur-sm border border-red-200/50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
