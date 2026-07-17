import { AnimatePresence } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../../types/project';

interface Props { projects: Project[]; onTag: (t: string) => void; }

export function ProjectList({ projects, onTag }: Props) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed border-border rounded-lg bg-muted/10">
        <p className="text-muted-foreground font-mono text-sm">No projects match these filters.</p>
      </div>
    );
  }
  return (
    <div className="space-y-20">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <div key={project.id}>
            <ProjectCard project={project} index={index} onTag={onTag} />
            {index < projects.length - 1 && <div className="h-px bg-border mt-20" />}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
