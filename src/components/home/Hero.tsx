import { motion } from 'framer-motion';
import { Github, Mail, ArrowRight, ChevronDown, FileDown, FileText } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const roles = [
  'Artificial Intelligence Engineer',
  'Machine Learning Engineer',
  'Quantitative Systems Developer',
  'Blockchain Developer',
];

const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

function ResumeDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-medium transition-all hover:bg-accent active:scale-95"
      >
        Resume
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-44 rounded-lg border border-border bg-background shadow-lg overflow-hidden z-50">
          <a
            href="/data/resume.pdf"
            download
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors border-b border-border"
          >
            <FileDown className="w-4 h-4 text-red-500" />
            <span className="font-medium">Download PDF</span>
          </a>
          <a
            href="/data/resume.docx"
            download
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors"
          >
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Download DOCX</span>
          </a>
        </div>
      )}
    </div>
  );
}

export function Hero() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-8 pt-4"
    >
      <motion.div variants={item} className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Open to internships & research collaborations
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.05]">
          Shankha Suvro<br />
          <span className="text-muted-foreground/60">Mullick</span>
        </h1>
        <div className="flex flex-col space-y-0.5 font-mono text-sm text-muted-foreground uppercase tracking-widest">
          {roles.map((role, i) => (
            <motion.span key={role} variants={item} custom={i}>{role}</motion.span>
          ))}
        </div>
      </motion.div>

      <motion.p variants={item} className="text-lg md:text-xl text-foreground/75 max-w-2xl leading-relaxed font-light">
        I build <strong className="font-semibold text-foreground">sub-millisecond trading systems</strong> and intelligent tools at the intersection of AI, quantitative finance, and systems engineering. Incoming CS (AI/ML) @ KIIT.
      </motion.p>

      <motion.div variants={item} className="flex flex-wrap gap-3 pt-2">
        <a href="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-foreground text-background text-sm font-medium transition-all hover:opacity-90 active:scale-95 group">
          View Projects
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>

        <a href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-medium transition-all hover:bg-accent active:scale-95">
          <Mail className="w-4 h-4" />
          Contact
        </a>

        <a href="https://github.com/ShankhaSuvroMullick" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-medium transition-all hover:bg-accent active:scale-95">
          <Github className="w-4 h-4" />
          GitHub
        </a>

        <ResumeDropdown />
      </motion.div>
    </motion.section>
  );
}
