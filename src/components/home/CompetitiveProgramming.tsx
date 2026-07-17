import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';

interface PlatformStats {
  handle: string;
  url: string;
  rating: number | null;
  maxRating: number | null;
  title: string | null;
  problemsSolved: number | null;
  contests: number | null;
  easy?: number | null;
  medium?: number | null;
  hard?: number | null;
  error?: boolean;
}

interface CompetitiveData {
  codeforces: PlatformStats;
  leetcode: PlatformStats;
  atcoder: PlatformStats;
  last_updated: string;
}

function Platform({ name, data, color }: { name: string; data: PlatformStats; color: string }) {
  const stats = [
    { label: 'Rating', value: data.rating },
    { label: 'Max Rating', value: data.maxRating },
    { label: 'Title', value: data.title },
    { label: 'Problems Solved', value: data.problemsSolved },
    ...(data.easy != null ? [{ label: 'Easy', value: data.easy }] : []),
    ...(data.medium != null ? [{ label: 'Medium', value: data.medium }] : []),
    ...(data.hard != null ? [{ label: 'Hard', value: data.hard }] : []),
    { label: 'Contests', value: data.contests },
  ].filter(s => s.value !== null && s.value !== undefined);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${color}`} />
          <h4 className="font-mono text-sm font-bold text-foreground">{name}</h4>
          {data.title && (
            <span className="text-xs font-mono px-2 py-0.5 rounded border border-border bg-secondary text-secondary-foreground">
              {data.title}
            </span>
          )}
        </div>
        <a href={data.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-md hover:bg-accent transition-colors">
          Profile <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {data.error ? (
        <p className="text-xs font-mono text-muted-foreground pl-4">// Stats unavailable — will retry next sync</p>
      ) : stats.length === 0 ? (
        <p className="text-xs font-mono text-muted-foreground pl-4">// Syncing stats — check back soon</p>
      ) : (
        <div className="flex flex-wrap gap-x-5 gap-y-1 pl-4">
          {stats.map(s => (
            <span key={s.label} className="text-sm text-muted-foreground">
              <span className="font-mono text-xs text-muted-foreground/60 uppercase">{s.label}:</span>{' '}
              <span className="text-foreground font-medium">{s.value}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompetitiveProgramming() {
  const [data, setData] = useState<CompetitiveData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/data/competitive.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="h-px bg-border" />
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-display font-bold tracking-tight">Competitive Programming</h2>
        {data?.last_updated && (
          <span className="text-xs font-mono text-muted-foreground">
            Updated: {new Date(data.last_updated).toLocaleDateString()}
          </span>
        )}
      </div>

      {!loaded ? (
        <div className="text-sm font-mono text-muted-foreground">Loading stats...</div>
      ) : !data ? (
        <div className="py-10 border border-dashed border-border rounded-lg text-center">
          <p className="font-mono text-sm text-muted-foreground">// Stats syncing</p>
        </div>
      ) : (
        <div className="space-y-8">
          <Platform name="Codeforces" data={data.codeforces} color="bg-red-500" />
          <div className="h-px bg-border" />
          <Platform name="LeetCode" data={data.leetcode} color="bg-amber-500" />
          <div className="h-px bg-border" />
          <Platform name="AtCoder" data={data.atcoder} color="bg-blue-500" />
        </div>
      )}
      <div className="h-px bg-border" />
    </motion.section>
  );
}
