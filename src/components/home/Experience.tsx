import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ExperienceItem {
  title: string;
  period: string;
  company: string;
  bullets: string[];
  stack: string[];
}

export function Experience() {
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/data/projects.json')
      .then(r => r.json())
      .then(data => { setItems(data.experience || []); setLoaded(true); })
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
      <h2 className="text-2xl font-display font-bold tracking-tight">Experience</h2>

      {!loaded ? (
        <div className="text-sm font-mono text-muted-foreground">Loading...</div>
      ) : items.length === 0 ? (
        <div className="py-10 border border-dashed border-border rounded-lg text-center">
          <p className="font-mono text-sm text-muted-foreground">// No experience added yet</p>
          <p className="text-xs text-muted-foreground mt-2">
            Add entries to <code className="bg-muted px-1 rounded">experience</code> array in <code className="bg-muted px-1 rounded">public/data/projects.json</code>
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {items.map((exp, i) => (
            <div key={i} className="space-y-3">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
                <h3 className="text-lg font-bold">{exp.title}</h3>
                <span className="text-sm font-mono text-muted-foreground shrink-0">{exp.period}</span>
              </div>
              <p className="text-primary font-medium">{exp.company}</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
              {exp.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {exp.stack.map(s => (
                    <span key={s} className="text-xs font-mono bg-secondary text-secondary-foreground px-2 py-1 rounded border border-border">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="h-px bg-border" />
    </motion.section>
  );
}
