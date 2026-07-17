import { cn } from '../../lib/utils';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> { variant?: string; }
export function Badge({ className, ...props }: BadgeProps) {
  return <span className={cn('inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-mono font-medium transition-colors', className)} {...props} />;
}
