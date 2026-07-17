import type { Project, ProjectData } from '../types/project';

let cache: ProjectData | null = null;

export async function getProjectData(): Promise<ProjectData> {
  if (cache) return cache;
  const base = import.meta.env.BASE_URL ?? '/';
  const res = await fetch(`${base}data/projects.json`);
  cache = await res.json();
  return cache!;
}

export function filterProjects(
  projects: Project[],
  opts: {
    category?: string;
    subcategory?: string;
    difficulty?: string;
    status?: string;
    language?: string;
    framework?: string;
    database?: string;
    tool?: string;
    cloud?: string;
    year?: string;
    search?: string;
    jdTerms?: string[];
  }
): Project[] {
  let r = projects;
  const { category, subcategory, difficulty, status, language, framework, database, tool, cloud, year, search, jdTerms } = opts;

  if (category === 'featured') r = r.filter(p => p.featured);
  else if (category && category !== 'all') r = r.filter(p => p.category === category);
  if (subcategory) r = r.filter(p => p.subcategory === subcategory);
  if (difficulty) r = r.filter(p => p.difficulty === difficulty);
  if (status) r = r.filter(p => p.status === status);
  if (language) r = r.filter(p => p.languages.includes(language));
  if (framework) r = r.filter(p => p.frameworks.includes(framework));
  if (database) r = r.filter(p => p.databases.includes(database));
  if (tool) r = r.filter(p => p.tools.includes(tool));
  if (cloud) r = r.filter(p => p.cloud.includes(cloud));
  if (year) r = r.filter(p => p.started?.startsWith(year));

  if (jdTerms && jdTerms.length > 0) {
    r = r.filter(p => {
      const hay = [...p.languages, ...p.frameworks, ...p.databases, ...p.tools, ...p.cloud, ...p.concepts, ...p.tags].join(' ').toLowerCase();
      return jdTerms.some(t => hay.includes(t.toLowerCase()));
    });
  }

  if (search?.trim()) {
    const q = search.toLowerCase();
    r = r.filter(p => [p.name, p.description, p.subcategory, p.benchmark || '',
      ...p.languages, ...p.frameworks, ...p.databases, ...p.tools, ...p.tags, ...p.concepts]
      .join(' ').toLowerCase().includes(q));
  }

  return r.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (b.last_updated || '').localeCompare(a.last_updated || '');
  });
}
