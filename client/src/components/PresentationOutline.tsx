import { Clock } from 'lucide-react';
import type { PresentationOutline as OutlineType } from '../types';

interface Props {
  outline: OutlineType;
}

export default function PresentationOutline({ outline }: Props) {
  return (
    <div className="rounded-2xl bg-white/55 backdrop-blur-xl border border-white/50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-indigo-700">Presentation Outline</h3>
        <span className="flex items-center gap-1.5 text-xs text-indigo-400">
          <Clock className="w-3.5 h-3.5" />
          ~{outline.estimated_duration_minutes} min
        </span>
      </div>
      <div className="space-y-0">
        {outline.sections.map((section, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <div className={`w-3 h-3 rounded-full border-2 ${i <= outline.sections.length - 1 ? 'border-indigo-400 bg-indigo-100' : 'border-indigo-200'}`} />
              {i < outline.sections.length - 1 && <div className="w-0.5 flex-1 bg-indigo-200 my-0.5 min-h-[24px]" />}
            </div>
            <div className="pb-4 flex-1">
              <p className="text-sm font-medium text-indigo-800">{section.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {section.key_points.map((kp, j) => (
                  <span key={j} className="text-xs text-indigo-400 bg-indigo-50/60 px-2 py-0.5 rounded-lg">
                    {kp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
