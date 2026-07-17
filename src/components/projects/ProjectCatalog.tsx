import { useState, useEffect, useMemo } from 'react';
import { ProjectFilters } from './ProjectFilters';
import { ProjectList } from './ProjectList';
import { filterProjects } from '../../lib/projects';
import type { Project, Category } from '../../types/project';
import { Search, FileText } from 'lucide-react';
import { JDParser } from '../search/JDParser';
import { CmdK } from '../search/CmdK';

interface Props { projects: Project[]; categories: Category[]; }

export function ProjectCatalog({ projects, categories }: Props) {
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [language, setLanguage] = useState('');
  const [framework, setFramework] = useState('');
  const [database, setDatabase] = useState('');
  const [search, setSearch] = useState('');
  const [jdTerms, setJdTerms] = useState<string[]>([]);
  const [jdOpen, setJdOpen] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdkOpen(true); }
      if (e.key === 'Escape') { setCmdkOpen(false); setJdOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = useMemo(() => filterProjects(projects, {
    category, difficulty, status, language, framework, database, search, jdTerms
  }), [projects, category, difficulty, status, language, framework, database, search, jdTerms]);

  const activeFilters = [
    search && { label: `"${search}"`, clear: () => setSearch('') },
    category !== 'all' && { label: category, clear: () => setCategory('all') },
    difficulty && { label: difficulty, clear: () => setDifficulty('') },
    status && { label: status, clear: () => setStatus('') },
    language && { label: language, clear: () => setLanguage('') },
    framework && { label: framework, clear: () => setFramework('') },
    database && { label: database, clear: () => setDatabase('') },
    jdTerms.length > 0 && { label: `JD: ${jdTerms.length} terms`, clear: () => setJdTerms([]) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <>
      <CmdK open={cmdkOpen} onClose={() => setCmdkOpen(false)} projects={projects} onSelect={q => setSearch(q)} />
      <JDParser open={jdOpen} onClose={() => setJdOpen(false)} onApply={setJdTerms} allTech={[...new Set(projects.flatMap(p => [...p.languages, ...p.frameworks, ...p.databases, ...p.tools, ...p.concepts]))]} />

      <div className="space-y-6">
        {/* Search bar */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all" />
          </div>
          <button onClick={() => setCmdkOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background text-sm font-mono text-muted-foreground hover:bg-accent transition-colors">
            <kbd className="text-xs">⌘K</kbd>
          </button>
          <button onClick={() => setJdOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-mono transition-colors ${jdTerms.length > 0 ? 'border-foreground/30 bg-foreground/5 text-foreground' : 'border-border bg-background text-muted-foreground hover:bg-accent'}`}>
            <FileText className="h-4 w-4" />
            JD Parser {jdTerms.length > 0 && `(${jdTerms.length})`}
          </button>
        </div>

        {/* Filters */}
        <ProjectFilters
          categories={categories} projects={projects}
          active={category} onCategory={setCategory}
          difficulty={difficulty} onDifficulty={setDifficulty}
          status={status} onStatus={setStatus}
          language={language} onLanguage={setLanguage}
          framework={framework} onFramework={setFramework}
          database={database} onDatabase={setDatabase}
        />

        {/* Active chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-muted-foreground">Active:</span>
            {activeFilters.map(chip => (
              <button key={chip.label} onClick={chip.clear}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-border text-xs font-mono text-foreground hover:bg-accent transition-colors">
                {chip.label} ×
              </button>
            ))}
            <button onClick={() => { setSearch(''); setCategory('all'); setDifficulty(''); setStatus(''); setLanguage(''); setFramework(''); setDatabase(''); setJdTerms([]); }}
              className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors underline">
              Reset all
            </button>
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-mono text-muted-foreground">{filtered.length} of {projects.length} projects</p>
        </div>

        <ProjectList projects={filtered} onTag={t => setSearch(t)} />
      </div>
    </>
  );
}
