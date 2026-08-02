import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * FeedbackList
 * Renders a titled list of strength or weakness bullet items.
 * Props:
 *   title  – section heading
 *   items  – string[]
 *   variant – 'strength' | 'weakness'
 */
export default function FeedbackList({ title, items, variant = 'strength' }) {
  const isStrength = variant === 'strength';

  const containerCls = isStrength
    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50';

  const iconCls = isStrength
    ? 'text-emerald-500'
    : 'text-red-400';

  const headingCls = isStrength
    ? 'text-emerald-700 dark:text-emerald-400'
    : 'text-red-600 dark:text-red-400';

  const textCls = isStrength
    ? 'text-emerald-700 dark:text-emerald-300/80'
    : 'text-red-600 dark:text-red-300/80';

  const Icon = isStrength ? CheckCircle2 : AlertCircle;

  return (
    <div className={`border rounded-2xl p-5 space-y-3 ${containerCls}`}>
      <h3 className={`text-xs font-extrabold uppercase tracking-wider ${headingCls}`}>
        {title}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${iconCls}`} />
            <span className={`text-sm font-semibold leading-relaxed ${textCls}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
