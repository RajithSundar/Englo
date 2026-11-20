import React from 'react';
import { Check } from 'lucide-react';

/**
 * The completed mark: a green circle with a white tick. It is the one colour in
 * the greyscale system, kept for a single meaning: this problem is solved.
 * With `label`, the word "Solved" sits beside it; without, it carries an
 * accessible name of its own.
 */
export const SolvedBadge: React.FC<{ size?: 'sm' | 'md'; label?: boolean; className?: string }> = ({
  size = 'md',
  label = false,
  className = '',
}) => {
  const circle = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const tick = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3';
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        role={label ? undefined : 'img'}
        aria-label={label ? undefined : 'Solved'}
        aria-hidden={label ? true : undefined}
        className={`inline-flex shrink-0 items-center justify-center rounded-full bg-done text-done-ink ${circle}`}
      >
        <Check className={tick} strokeWidth={3.25} aria-hidden />
      </span>
      {label && <span className="text-[13px] font-medium text-ink">Solved</span>}
    </span>
  );
};
