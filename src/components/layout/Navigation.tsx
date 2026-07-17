import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/utils';
import { Menu, X } from 'lucide-react';

interface Props { currentPath: string; }

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/research', label: 'Research' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/uses', label: 'Uses' },
  { href: '/now', label: 'Now' },
];

export function Navigation({ currentPath }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? currentPath === '/' : currentPath.startsWith(href);

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full transition-all duration-300',
      scrolled
        ? 'border-b border-border/60 bg-background/90 backdrop-blur-md shadow-sm'
        : 'border-b border-transparent bg-background/60 backdrop-blur-sm'
    )}>
      <nav className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between max-w-6xl">
        <a href="/" className="font-mono font-bold text-base tracking-tight hover:text-primary/80 transition-colors">
          ~/ssm
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <a key={link.href} href={link.href}
              className={cn(
                'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                isActive(link.href)
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map(link => (
              <a key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(link.href)
                    ? 'text-foreground bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
