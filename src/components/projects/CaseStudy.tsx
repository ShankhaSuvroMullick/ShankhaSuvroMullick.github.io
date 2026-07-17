import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { DifficultyBadge } from './DifficultyBadge';
import { Badge } from '../ui/badge';
import type { Project } from '../../types/project';
import { STATUS_COLORS } from '../../types/project';
import { cn } from '../../lib/utils';

export function CaseStudy({ project }: { project: Project }) {
  const cs = project.caseStudy;
  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="space-y-16 max-w-4xl mx-auto">
      {/* Back */}
      <motion.div variants={item}>
        <a href="/projects" className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </a>
      </motion.div>

      {/* Header */}
      <motion.header variants={item} className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge level={project.difficulty} />
          <span className={cn('px-2.5 py-0.5 rounded text-xs font-mono font-medium border', STATUS_COLORS[project.status])}>{project.status}</span>
          {project.featured && <span className="text-amber-500 text-sm font-medium">★ Featured</span>}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{project.name}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{project.description}</p>
        {project.benchmark && (
          <div className="inline-flex items-center gap-2 text-sm font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-lg">
            ⚡ {project.benchmark}
          </div>
        )}
        <div className="flex flex-wrap gap-3 pt-2">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent text-sm font-medium transition-colors">
              <Github className="h-4 w-4" /> View Source
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 text-sm font-medium transition-all">
              <ExternalLink className="h-4 w-4" /> Live Demo
            </a>
          )}
        </div>
        <div className="h-px bg-border" />
      </motion.header>

      {/* Case study sections */}
      {cs ? (
        <div className="space-y-12">
          {[
            { title: 'The Problem', content: cs.problem, type: 'text' },
            { title: 'Constraints', content: cs.constraints, type: 'list' },
            { title: 'Key Decisions', content: cs.decisions, type: 'list' },
            { title: 'Trade-offs', content: cs.tradeoffs, type: 'list' },
            { title: 'Metrics & Results', content: cs.metrics, type: 'list' },
            { title: 'What I\'d Do Differently', content: cs.retrospective, type: 'text' },
          ].map(({ title, content, type }) => (
            <motion.section key={title} variants={item} className="space-y-4">
              <h2 className="text-lg font-display font-bold border-b border-border pb-2">{title}</h2>
              {type === 'text' ? (
                <p className="text-muted-foreground leading-relaxed">{content as string}</p>
              ) : (
                <ul className="space-y-2">
                  {(content as string[]).map((c, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <span className="text-primary font-mono text-xs mt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>
      ) : (
        <motion.div variants={item} className="py-16 text-center border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground font-mono text-sm">Case study coming soon.</p>
          <p className="text-muted-foreground text-xs mt-2">Add <code className="bg-muted px-1 rounded">caseStudy</code> field to this project in projects.json</p>
        </motion.div>
      )}

      {/* Stack */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="text-lg font-display font-bold border-b border-border pb-2">Full Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Languages', items: project.languages },
            { label: 'Frameworks', items: project.frameworks },
            { label: 'Databases', items: project.databases },
            { label: 'Tools', items: project.tools },
            { label: 'Cloud', items: project.cloud },
            { label: 'Concepts', items: project.concepts },
          ].filter(g => g.items.length > 0).map(group => (
            <div key={group.label}>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{group.label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(item => (
                  <Badge key={item} className="font-mono text-xs bg-secondary text-secondary-foreground border-border/60 rounded-none">{item}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
