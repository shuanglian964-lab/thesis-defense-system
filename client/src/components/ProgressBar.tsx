interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
          Question {current} of {total}
        </span>
        <span className="text-xs text-indigo-400">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full bg-indigo-100/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
