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

  const dropBg = isDragging ? 'bg-accent-50/80' : 'bg-surface-raised/80';
  const dropBorder = isDragging ? 'border-accent' : 'border-neutral-200';
  const dropShadow = isDragging ? 'shadow-lg shadow-accent/10' : 'shadow-sm';
  const dropScale = isDragging ? 'scale-[1.02]' : '';
  const loadingState = isLoading ? 'pointer-events-none opacity-50' : '';

  return (
    <div className="w-full max-w-lg">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`relative p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${dropBg} ${dropBorder} ${dropShadow} ${dropScale} ${loadingState}
          hover:shadow-md hover:-translate-y-0.5`}
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
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent-50">
              <FileText className="w-6 h-6 text-accent" />
            </div>
          ) : (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors border
              ${isDragging ? 'bg-accent-50 border-accent/20' : 'bg-surface-raised border-neutral-200'}`}>
              <Upload className={`w-6 h-6 ${isDragging ? 'text-accent' : 'text-neutral-400'}`} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {file ? (
              <>
                <p className="text-sm font-semibold text-neutral-900 truncate">{file.name}</p>
                <p className="text-xs mt-0.5 text-neutral-400">
                  {(file.size / 1024 / 1024).toFixed(1)} MB · Click to change
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-neutral-800">
                  Drop your English thesis PDF
                </p>
                <p className="text-xs mt-0.5 text-neutral-400">
                  or click to browse · PDF only · Max 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl flex items-center gap-3 bg-error-50/80 border border-error/20">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
          <p className="text-sm text-error-700">{error}</p>
        </div>
      )}
    </div>
  );
}
