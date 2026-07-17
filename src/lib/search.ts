import Fuse from 'fuse.js';
import type { Project } from '../types/project';

export function buildSearchIndex(projects: Project[]) {
  return new Fuse(projects, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.15 },
      { name: 'languages', weight: 0.1 },
      { name: 'concepts', weight: 0.05 },
    ],
    threshold: 0.3,
    includeScore: true,
  });
}
