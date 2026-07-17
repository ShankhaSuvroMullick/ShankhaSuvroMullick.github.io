import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PlatformStats {
  handle: string;
  url: string;
  rating: number | null;
  maxRating: number | null;
  title: string | null;
  problemsSolved: number | null;
  contests: number | null;
  error?: boolean;
}

interface CompetitiveData {
  codeforces: PlatformStats;
  leetcode: PlatformStats;
  atcoder: PlatformStats;
  last_updated: string;
}

function Platform({ name, data }: { name: string; data: PlatformStats }) {
  const stats: { label: string; value: string | number }[] = [];

  if (data.rating != null)        stats.push({ label: 'Rating',         value: data.rating });
  if (data.maxRating != null)     stats.push({ label: 'Max Rating',     value: data.maxRating });
  if (data.title)                 stats.push({ label: 'Title',          value: data.title });
  if (data.problemsSolved != null)stats.push({ label: 'Problems Solved',value: data.problemsSolved });
  if (data.contests != null)      stats.push({ label: 'Contests',       value: data.contests });

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold text-foreground">{name}</span>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-md hover:bg-accent transition-colors"
        >
          → Profile
        </a>
      </div>

      <div className="pl-2">
        {data.error ? (
          <span className="text-xs font-mono text-muted-foreground">// Stats unavailable — will retry next sync</span>
        ) : stats.length === 0 ? (
          <span className="text-xs font-mono text-muted-foreground">// Syncing stats — check back soon</span>
        ) : (
          <div className="flex flex-wrap items-center">
            {stats.map((s, i) => (
              <span key={s.label} className="flex items-center text-sm">
                <span className="text-muted-foreground/60 text-xs font-mono uppercase">{s.label}: </span>
                <span className="text-foreground font-medium ml-0.5">{s.value}</span>
                {i < stats.length - 1 && (
                  <span className="text-muted-foreground/40 mx-2">·</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
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
        <div className="space-y-6">
          <Platform name="Codeforces" data={data.codeforces} />
          <div className="h-px bg-border/50" />
          <Platform name="LeetCode" data={data.leetcode} />
          <div className="h-px bg-border/50" />
          <Platform name="AtCoder" data={data.atcoder} />
        </div>
      )}
      <div className="h-px bg-border" />
    </motion.section>
  );
}
