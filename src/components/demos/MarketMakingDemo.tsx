import { useState, useEffect, useRef, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Tick { t: number; mid: number; bid: number; ask: number; pnl: number; }

function generateTick(prev: Tick, spread: number, vol: number, inventory: number): Tick {
  const drift = -inventory * 0.001;
  const shock = (Math.random() - 0.5) * vol;
  const mid = Math.max(90, Math.min(110, prev.mid + drift + shock));
  const skew = inventory * 0.002;
  const bid = mid - spread / 2 + skew;
  const ask = mid + spread / 2 + skew;
  const executed = Math.random() < 0.15;
  const pnl = prev.pnl + (executed ? spread * 0.5 * (Math.random() > 0.5 ? 1 : -1) : 0);
  return { t: prev.t + 1, mid, bid, ask, pnl };
}

export function MarketMakingDemo() {
  const [spread, setSpread] = useState(0.5);
  const [vol, setVol] = useState(0.3);
  const [running, setRunning] = useState(false);
  const [data, setData] = useState<Tick[]>([{ t: 0, mid: 100, bid: 99.75, ask: 100.25, pnl: 0 }]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const tick = useCallback(() => {
    setData(prev => {
      const last = prev[prev.length - 1];
      const inventory = prev.slice(-20).reduce((s, d) => s + (d.bid > d.mid - spread / 2 ? 1 : -1), 0);
      const next = generateTick(last, spread, vol, inventory);
      return [...prev.slice(-80), next];
    });
  }, [spread, vol]);

  useEffect(() => {
    if (running) { intervalRef.current = setInterval(tick, 120); }
    else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const last = data[data.length - 1];
  const winRate = data.filter((_, i) => i > 0 && data[i].pnl > data[i - 1].pnl).length / Math.max(1, data.length - 1);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-mono font-semibold text-sm text-foreground">HFT Market Making Simulator</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live bid-ask spread quoting with inventory management</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-xs font-mono text-muted-foreground">{running ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 border-b border-border">
        {[
          { label: 'Mid Price', value: last.mid.toFixed(3) },
          { label: 'Spread', value: spread.toFixed(2) },
          { label: 'P&L', value: (last.pnl >= 0 ? '+' : '') + last.pnl.toFixed(3), color: last.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400' },
          { label: 'Win Rate', value: (winRate * 100).toFixed(1) + '%' },
        ].map(s => (
          <div key={s.label} className="p-3 text-center border-r border-border last:border-r-0">
            <div className={`font-mono text-sm font-semibold ${s.color || 'text-foreground'}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider font-mono">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="t" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
            />
            <Line type="monotone" dataKey="mid" stroke="hsl(var(--foreground))" strokeWidth={1.5} dot={false} name="Mid" />
            <Line type="monotone" dataKey="bid" stroke="#3b82f6" strokeWidth={1} dot={false} strokeDasharray="3 3" name="Bid" />
            <Line type="monotone" dataKey="ask" stroke="#ef4444" strokeWidth={1} dot={false} strokeDasharray="3 3" name="Ask" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      <div className="px-5 py-4 border-t border-border space-y-3">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Spread: {spread.toFixed(2)}</label>
            <input type="range" min="0.1" max="2" step="0.1" value={spread} onChange={e => setSpread(+e.target.value)}
              className="w-full mt-1 accent-foreground" />
          </div>
          <div>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Volatility: {vol.toFixed(1)}</label>
            <input type="range" min="0.1" max="1" step="0.1" value={vol} onChange={e => setVol(+e.target.value)}
              className="w-full mt-1 accent-foreground" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setRunning(!running)}
            className="flex-1 py-2 rounded-md bg-foreground text-background text-xs font-mono font-medium hover:opacity-90 transition-all active:scale-95">
            {running ? '⏸ Pause' : '▶ Start Simulation'}
          </button>
          <button onClick={() => { setRunning(false); setData([{ t: 0, mid: 100, bid: 99.75, ask: 100.25, pnl: 0 }]); }}
            className="px-4 py-2 rounded-md border border-border text-xs font-mono text-muted-foreground hover:bg-accent transition-colors">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
