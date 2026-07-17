import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Badge } from '../ui/badge';
import { DifficultyBadge } from './DifficultyBadge';
import { cn } from '../../lib/utils';
import type { Project } from '../../types/project';
import { STATUS_COLORS } from '../../types/project';

interface Props { project: Project; index: number; onTag: (t: string) => void; }

export function ProjectCard({ project, index, onTag }: Props) {
  const allStack = [...project.languages, ...project.frameworks];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative"
    >
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="text-2xl font-display font-bold tracking-tight group-hover:text-primary/80 transition-colors">
              {project.name}
            </h3>
            <DifficultyBadge level={project.difficulty} />
            <span className={cn('px-2.5 py-0.5 rounded text-xs font-mono font-medium border', STATUS_COLORS[project.status])}>
              {project.status}
            </span>
            {project.featured && <span className="text-amber-500 text-sm">★ Featured</span>}
          </div>
          <div className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
            {project.subcategory} · {project.started}
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border bg-background hover:bg-accent transition-colors rounded-md">
              <Github className="w-4 h-4" /> Source
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-foreground text-background hover:opacity-90 transition-all rounded-md shadow-sm">
              <ExternalLink className="w-4 h-4" /> Demo
            </a>
          )}
          <a href={`/projects/${project.id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border bg-background hover:bg-accent transition-colors rounded-md">
            Case Study <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Benchmark */}
      {project.benchmark && (
        <div className="mb-6 inline-flex items-center gap-2 text-sm font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-md">
          ⚡ {project.benchmark}
        </div>
      )}

      {/* Two-column content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm leading-relaxed">
        {/* Left: Problem, Architecture, Challenges */}
        <div className="md:col-span-7 space-y-8">
          {project.description && (
            <section>
              <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Problem Statement</h4>
              <p className="text-foreground/90 text-base leading-relaxed">{project.description}</p>
            </section>
          )}
          {project.architectureOverview && (
            <section>
              <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Architecture Overview</h4>
              <p className="text-muted-foreground">{project.architectureOverview}</p>
            </section>
          )}
          {project.challenges && project.challenges.length > 0 && (
            <section>
              <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Challenges & Solutions</h4>
              <div className="space-y-4">
                {project.challenges.map((item, idx) => (
                  <div key={idx} className="bg-muted/40 p-4 rounded-lg border border-border/60">
                    <p className="font-medium text-foreground mb-2 flex items-start gap-2">
                      <span className="text-destructive font-mono text-xs mt-0.5 shrink-0">PROBLEM</span>
                      {item.challenge}
                    </p>
                    <p className="text-muted-foreground flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs mt-0.5 shrink-0">SOLUTION</span>
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Stack, Concepts, Features */}
        <div className="md:col-span-5 space-y-8">
          {allStack.length > 0 && (
            <section>
              <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {allStack.map(tech => (
                  <Badge key={tech} className="font-mono text-xs rounded-none border-border/60 bg-secondary text-secondary-foreground cursor-pointer hover:bg-accent"
                    onClick={() => onTag(tech)}>{tech}</Badge>
                ))}
                {project.databases.map(db => (
                  <Badge key={db} className="font-mono text-xs rounded-none border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 cursor-pointer"
                    onClick={() => onTag(db)}>{db}</Badge>
                ))}
              </div>
            </section>
          )}
          {project.concepts && project.concepts.length > 0 && (
            <section>
              <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Core Concepts</h4>
              <ul className="space-y-1.5">
                {project.concepts.map(concept => (
                  <li key={concept} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                    {concept}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.features && project.features.length > 0 && (
            <section>
              <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Key Features</h4>
              <ul className="space-y-2">
                {project.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-foreground/80">
                    <ArrowRight className="w-3 h-3 mt-1 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {project.tags.length > 0 && (
            <section>
              <h4 className="font-mono text-xs font-bold uppercase text-muted-foreground mb-3 tracking-wider">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map(tag => (
                  <button key={tag} onClick={() => onTag(tag)}
                    className="text-xs font-mono px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors bg-background">
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.article>
  );
}
