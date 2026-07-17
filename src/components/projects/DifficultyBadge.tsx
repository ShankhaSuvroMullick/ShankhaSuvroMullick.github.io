import { cn } from '../../lib/utils';
import { DIFF_COLORS, type Difficulty } from '../../types/project';

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span className={cn('px-2.5 py-0.5 rounded text-xs font-mono font-medium border', DIFF_COLORS[level])}>
      {level}
    </span>
  );
}
