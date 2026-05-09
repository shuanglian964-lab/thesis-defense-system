import { useState } from 'react';
import { Clock, Copy, Download, Check } from 'lucide-react';
import type { PresentationOutline as OutlineType } from '../types';

interface Props {
  outline: OutlineType;
}

export default function PresentationOutline({ outline }: Props) {
  const [copied, setCopied] = useState(false);

  const buildText = () => {
    let text = `Presentation Outline — ~${outline.estimated_duration_minutes} min\n\n`;
    outline.sections.forEach((s, i) => {
      text += `${i + 1}. ${s.title}  (${s.duration_minutes} min)\n`;
      s.key_points.forEach((kp) => {
        text += `   - ${kp}\n`;
      });
      text += '\n';
    });
    return text;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([buildText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation-outline.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="surface-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="heading-3">Presentation Outline</h3>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-neutral-400 mr-2">
            <Clock className="w-3.5 h-3.5" />
            ~{outline.estimated_duration_minutes} min
          </span>
          <button
            onClick={handleCopy}
            title="Copy outline"
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            title="Download outline"
            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-0">
        {outline.sections.map((section, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full border-2 border-neutral-400 bg-neutral-100" />
              {i < outline.sections.length - 1 && (
                <div className="w-0.5 flex-1 bg-neutral-200 my-0.5 min-h-[24px]" />
              )}
            </div>
            <div className="pb-4 flex-1">
              <p className="text-sm font-medium text-neutral-800">{section.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {section.key_points.map((kp, j) => (
                  <span key={j} className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-lg">
                    {kp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {copied && (
        <p className="text-xs text-success text-center mt-2 animate-pulse">Copied to clipboard!</p>
      )}
    </div>
  );
}
