import { useState, useEffect, useRef, useMemo } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { DifficultyBadge } from '../projects/DifficultyBadge';
import type { Project } from '../../types/project';

interface Props { open: boolean; onClose: () => void; projects: Project[]; onSelect: (q: string) => void; }

export function CmdK({ open, onClose, projects, onSelect }: Props) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQ(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return projects.filter(p => p.featured).slice(0, 6);
    const lower = q.toLowerCase();
    return projects.filter(p =>
      [p.name, p.description, ...p.languages, ...p.frameworks, ...p.tags, ...p.concepts]
        .join(' ').toLowerCase().includes(lower)
    ).slice(0, 8);
  }, [q, projects]);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="overflow-hidden p-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <span className="text-muted-foreground text-sm">⌕</span>
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search projects..."
            className="flex-1 bg-transparent outline-none text-sm font-mono text-foreground placeholder:text-muted-foreground"
            onKeyDown={e => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && q.trim()) { onSelect(q); onClose(); }
            }} />
          <kbd className="text-xs font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">ESC</kbd>
        </div>
        <ScrollArea className="max-h-96">
          {results.length === 0
            ? <div className="py-10 text-center text-sm text-muted-foreground font-mono">No results</div>
            : results.map(p => (
              <button key={p.id} onClick={() => { onSelect(p.name); onClose(); }}
                className="w-full text-left px-4 py-3 flex items-center gap-3 border-b border-border last:border-0 hover:bg-accent transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono font-medium text-foreground truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground truncate mt-0.5">{p.description}</div>
                </div>
                <DifficultyBadge level={p.difficulty} />
              </button>
            ))
          }
        </ScrollArea>
        <div className="px-4 py-2 border-t border-border">
          <span className="text-xs font-mono text-muted-foreground">↵ search · ESC close · ⌘K open</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
