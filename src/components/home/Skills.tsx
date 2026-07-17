import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SkillGroup { title: string; skills: string[]; }

function SkillCategory({ title, skills, index }: { title: string; skills: string[]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="space-y-4"
    >
      <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-3">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {skills.map(skill => (
          <li key={skill} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-default leading-relaxed">
            {skill}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function groupSkills(projects: any[]): SkillGroup[] {
  const languages = new Set<string>();
  const frameworks = new Set<string>();
  const databases = new Set<string>();
  const tools = new Set<string>();
  const cloud = new Set<string>();
  // NOTE: concepts deliberately excluded per request

  for (const p of projects) {
    (p.languages || []).forEach((s: string) => languages.add(s));
    (p.frameworks || []).forEach((s: string) => frameworks.add(s));
    (p.databases || []).forEach((s: string) => databases.add(s));
    (p.tools || []).forEach((s: string) => tools.add(s));
    (p.cloud || []).forEach((s: string) => cloud.add(s));
  }

  const groups: SkillGroup[] = [];
  if (languages.size) groups.push({ title: 'Programming Languages', skills: [...languages].sort() });
  if (frameworks.size) groups.push({ title: 'Frameworks & Libraries', skills: [...frameworks].sort() });
  if (databases.size) groups.push({ title: 'Databases & Data Systems', skills: [...databases].sort() });
  if (tools.size) groups.push({ title: 'Tools', skills: [...tools].sort() });
  if (cloud.size) groups.push({ title: 'Cloud & Infrastructure', skills: [...cloud].sort() });
  return groups;
}

export function Skills() {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/data/projects.json')
      .then(r => r.json())
      .then(data => { setGroups(groupSkills(data.projects || [])); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="h-px bg-border" />
      <h2 className="text-2xl font-display font-bold tracking-tight">Technical Skills</h2>

      {!loaded ? (
        <div className="text-sm font-mono text-muted-foreground">Loading...</div>
      ) : groups.length === 0 ? (
        <div className="py-10 border border-dashed border-border rounded-lg text-center">
          <p className="font-mono text-sm text-muted-foreground">// Skills auto-populate from your projects</p>
          <p className="text-xs text-muted-foreground mt-2">Add projects to <code className="bg-muted px-1 rounded">public/data/projects.json</code></p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
          {groups.map((g, i) => (
            <SkillCategory key={g.title} title={g.title} skills={g.skills} index={i} />
          ))}
        </div>
      )}
      <div className="h-px bg-border" />
    </motion.section>
  );
}
