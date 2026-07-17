import { useEffect, useRef, useState } from 'react';

interface Level { price: number; size: number; }

function generateBook(mid: number): { bids: Level[]; asks: Level[] } {
  const bids: Level[] = [];
  const asks: Level[] = [];
  for (let i = 0; i < 8; i++) {
    bids.push({ price: mid - (i + 1) * 0.25, size: Math.random() * 100 + 10 });
    asks.push({ price: mid + (i + 1) * 0.25, size: Math.random() * 100 + 10 });
  }
  return { bids, asks };
}

export function OrderBookViz() {
  const [mid, setMid] = useState(100);
  const [book, setBook] = useState(generateBook(100));
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setMid(prev => {
        const next = prev + (Math.random() - 0.5) * 0.5;
        setBook(generateBook(next));
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [running]);

  const maxSize = Math.max(...book.bids.map(b => b.size), ...book.asks.map(a => a.size));

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-mono font-semibold text-sm text-foreground">LOB Order Book Visualizer</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Limit order book depth — bid/ask spread simulation</p>
        </div>
        <div className="font-mono text-lg font-bold text-foreground">{mid.toFixed(3)}</div>
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="grid grid-cols-3 text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 px-2">
          <span>Size</span>
          <span className="text-center">Price</span>
          <span className="text-right">Size</span>
        </div>

        {/* Asks (reversed) */}
        <div className="space-y-0.5 mb-1">
          {[...book.asks].reverse().map((a, i) => (
            <div key={i} className="relative grid grid-cols-3 items-center text-xs font-mono py-0.5 px-2">
              <div className="absolute inset-0 right-1/2" style={{ background: `rgba(239,68,68,${(a.size / maxSize) * 0.15})` }} />
              <span className="text-muted-foreground text-right pr-2">{a.size.toFixed(0)}</span>
              <span className="text-red-600 dark:text-red-400 text-center font-semibold">{a.price.toFixed(3)}</span>
              <span></span>
            </div>
          ))}
        </div>

        {/* Spread */}
        <div className="text-center py-1 text-xs font-mono text-muted-foreground border-y border-border my-1">
          Spread: {(book.asks[0]?.price - book.bids[0]?.price).toFixed(3)} · Mid: {mid.toFixed(3)}
        </div>

        {/* Bids */}
        <div className="space-y-0.5 mt-1">
          {book.bids.map((b, i) => (
            <div key={i} className="relative grid grid-cols-3 items-center text-xs font-mono py-0.5 px-2">
              <div className="absolute inset-0 left-1/2" style={{ background: `rgba(34,197,94,${(b.size / maxSize) * 0.15})` }} />
              <span></span>
              <span className="text-emerald-600 dark:text-emerald-400 text-center font-semibold">{b.price.toFixed(3)}</span>
              <span className="text-muted-foreground pl-2">{b.size.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-border flex gap-3">
        <button onClick={() => setRunning(!running)}
          className="flex-1 py-2 rounded-md bg-foreground text-background text-xs font-mono hover:opacity-90 transition-all active:scale-95">
          {running ? '⏸ Pause' : '▶ Start Live Feed'}
        </button>
      </div>
    </div>
  );
}
