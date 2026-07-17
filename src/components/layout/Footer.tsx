export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-24">
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/" className="font-mono font-bold text-foreground">~/ssm</a>
            <a href="/projects" className="hover:text-foreground transition-colors">Projects</a>
            <a href="/research" className="hover:text-foreground transition-colors">Research</a>
            <a href="/blog" className="hover:text-foreground transition-colors">Blog</a>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="https://github.com/ShankhaSuvroMullick" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-mono">GitHub ↗</a>
            <span>·</span>
            <p className="font-mono text-xs">© {year} Shankha Suvro Mullick</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
