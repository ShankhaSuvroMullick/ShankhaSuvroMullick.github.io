import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Stat { label: string; value: number; suffix?: string; prefix?: string; }

const stats: Stat[] = [
  { label: 'Projects Built', value: 3, suffix: '+' },
  { label: 'Median Latency', value: 1, prefix: '<', suffix: 'μs' },
  { label: 'Per-tick Win Rate', value: 61.5, suffix: '%' },
  { label: 'Order Executions', value: 4682, suffix: '+' },
  { label: 'Languages', value: 8, suffix: '+' },
];

function Counter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1200;
        const steps = 40;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) { setCount(value); clearInterval(timer); }
          else setCount(Math.floor(current * 10) / 10);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{prefix}{Number.isInteger(value) ? count : count.toFixed(1)}{suffix}</span>;
}

export function Stats() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-5 border border-border rounded-lg overflow-hidden bg-card"
    >
      {stats.map((s, i) => (
        <div key={s.label} className={`p-5 text-center ${i < stats.length - 1 ? 'border-r border-border' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-border' : ''}`}>
          <div className="font-display text-2xl font-bold text-foreground">
            <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
          </div>
          <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-mono">{s.label}</div>
        </div>
      ))}
    </motion.section>
  );
}
