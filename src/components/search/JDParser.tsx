import { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { TECH_KEYWORDS } from '../../types/project';

interface Props { open: boolean; onClose: () => void; onApply: (terms: string[]) => void; allTech: string[]; }

export function JDParser({ open, onClose, onApply, allTech }: Props) {
  const [text, setText] = useState('');

  const extracted = useMemo(() => {
    if (!text.trim()) return [];
    const lower = text.toLowerCase();
    const found = new Set<string>();
    allTech.forEach(t => { if (lower.includes(t.toLowerCase())) found.add(t); });
    TECH_KEYWORDS.forEach(k => { if (lower.includes(k.toLowerCase())) found.add(k); });
    return [...found].sort();
  }, [text, allTech]);

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="font-mono text-sm font-semibold text-foreground">Job Description Parser</div>
          <div className="text-xs text-muted-foreground mt-0.5">Paste a JD → extract tech terms → filter your projects</div>
        </div>
        <div className="p-4 space-y-3">
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste job description here..."
            rows={8}
            className="w-full rounded-md border border-border bg-background text-foreground text-xs font-mono p-3 outline-none resize-none focus:ring-2 focus:ring-ring transition-all" />
          {extracted.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground">
                {extracted.length} tech terms found
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {extracted.map(t => (
                  <span key={t} className="text-xs font-mono px-2 py-0.5 rounded border border-border bg-secondary text-secondary-foreground">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <button onClick={onClose} className="text-xs font-mono px-3 py-1.5 rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors">Cancel</button>
          <button disabled={extracted.length === 0} onClick={() => { onApply(extracted); onClose(); setText(''); }}
            className="text-xs font-mono px-4 py-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            Filter {extracted.length > 0 ? `${extracted.length} terms` : ''}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
