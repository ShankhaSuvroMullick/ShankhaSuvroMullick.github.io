import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { Category, Project } from '../../types/project';
import { DIFFICULTIES, STATUSES } from '../../types/project';

interface Props {
  categories: Category[];
  projects: Project[];
  active: string;
  onCategory: (c: string) => void;
  difficulty: string;
  onDifficulty: (d: string) => void;
  status: string;
  onStatus: (s: string) => void;
  language: string;
  onLanguage: (l: string) => void;
  framework: string;
  onFramework: (f: string) => void;
  database: string;
  onDatabase: (d: string) => void;
}

export function ProjectFilters({ categories, projects, active, onCategory, difficulty, onDifficulty, status, onStatus, language, onLanguage, framework, onFramework, database, onDatabase }: Props) {
  const tabs = [{ id: 'all', label: 'All' }, { id: 'featured', label: '★ Featured' }, ...categories.map(c => ({ id: c.id, label: `${c.icon} ${c.label}` }))];

  const langs = [...new Set(projects.flatMap(p => p.languages))].sort();
  const frameworks = [...new Set(projects.flatMap(p => p.frameworks))].sort();
  const databases = [...new Set(projects.flatMap(p => p.databases))].sort();

  const Sel = ({ value, onChange, opts, placeholder }: { value: string; onChange: (v: string) => void; opts: string[]; placeholder: string }) => (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-xs font-mono outline-none cursor-pointer hover:bg-accent transition-colors">
      <option value="">{placeholder}</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div className="space-y-4">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border pb-0 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onCategory(tab.id)}
            className={cn(
              'relative px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0',
              active === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}>
            {tab.label}
            {active === tab.id && (
              <motion.div layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
            )}
          </button>
        ))}
      </div>

      {/* Secondary filters */}
      <div className="flex flex-wrap gap-2">
        <Sel value={difficulty} onChange={onDifficulty} opts={DIFFICULTIES} placeholder="Difficulty" />
        <Sel value={status} onChange={onStatus} opts={STATUSES} placeholder="Status" />
        <Sel value={language} onChange={onLanguage} opts={langs} placeholder="Language" />
        <Sel value={framework} onChange={onFramework} opts={frameworks} placeholder="Framework" />
        <Sel value={database} onChange={onDatabase} opts={databases} placeholder="Database" />
      </div>
    </div>
  );
}
