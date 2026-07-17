import { motion } from 'framer-motion';

export function Education() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="h-px bg-border" />
      <h2 className="text-2xl font-display font-bold tracking-tight">Education</h2>
      <div className="space-y-2">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
          <h3 className="text-lg font-bold">Bachelor of Technology — Computer Science & Engineering</h3>
          <span className="text-sm font-mono text-muted-foreground shrink-0">2026 – 2030</span>
        </div>
        <p className="text-primary font-medium">Specialization: Artificial Intelligence & Machine Learning</p>
        <p className="text-muted-foreground">KIIT — Kalinga Institute of Industrial Technology, Bhubaneswar</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pt-2">
          <li>Relevant coursework: Data Structures, Algorithms, Neural Networks, Probability & Statistics</li>
          <li>Focus areas: Quantitative Finance, Systems Programming, AI/ML Research</li>
        </ul>
      </div>
      <div className="h-px bg-border" />
    </motion.section>
  );
}
