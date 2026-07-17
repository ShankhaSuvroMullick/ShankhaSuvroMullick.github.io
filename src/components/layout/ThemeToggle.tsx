import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={cn(
        'relative w-9 h-9 rounded-full flex items-center justify-center',
        'border border-border bg-background',
        'transition-all duration-200 hover:scale-110 active:scale-95',
        'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      )}
    >
      <Sun className={cn('h-4 w-4 transition-all duration-300', theme === 'dark' ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0')} />
      <Moon className={cn('h-4 w-4 absolute transition-all duration-300', theme === 'light' ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0')} />
    </button>
  );
}
