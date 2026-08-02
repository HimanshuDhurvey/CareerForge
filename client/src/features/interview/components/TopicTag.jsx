import React from 'react';
import { BookOpen } from 'lucide-react';

/**
 * TopicTag
 * A small pill/chip representing a recommended study topic.
 * Props:
 *   topic – string label
 */
export default function TopicTag({ topic }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-full">
      <BookOpen className="h-3 w-3 shrink-0" />
      {topic}
    </span>
  );
}
