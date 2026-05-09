import { motion } from 'motion/react';

interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="caption">
          Question {current} of {total}
        </span>
        <span className="text-xs text-neutral-400">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}
