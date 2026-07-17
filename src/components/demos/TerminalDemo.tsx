import { useState, useRef, useEffect } from 'react';

const HELP = `
Available commands:
  add <title>          Add a new task
  list                 List all tasks
  done <id>            Mark task complete
  delete <id>          Delete a task
  search <query>       Search tasks
  stats                Show statistics
  clear                Clear terminal
  help                 Show this help
`.trim();

interface Task { id: number; title: string; done: boolean; created: string; }

export function TerminalDemo() {
  const [history, setHistory] = useState<string[]>(['CLI Task Manager v1.0.0 — Type "help" for commands.', '']);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Finish LOB benchmark', done: false, created: '2026-07-07' },
    { id: 2, title: 'Write FTTP essay', done: false, created: '2026-07-07' },
    { id: 3, title: 'Push all-projects site', done: true, created: '2026-07-07' },
  ]);
  const [nextId, setNextId] = useState(4);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const run = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const op = parts[0]?.toLowerCase();
    const args = parts.slice(1).join(' ');
    let output = '';

    if (op === 'help') { output = HELP; }
    else if (op === 'clear') { setHistory(['CLI Task Manager v1.0.0', '']); return; }
    else if (op === 'list') {
      if (tasks.length === 0) { output = 'No tasks found.'; }
      else output = tasks.map(t => `[${t.done ? '✓' : ' '}] #${t.id} ${t.title} (${t.created})`).join('\n');
    }
    else if (op === 'add') {
      if (!args) { output = 'Error: title required. Usage: add <title>'; }
      else {
        const task = { id: nextId, title: args, done: false, created: new Date().toISOString().split('T')[0] };
        setTasks(prev => [...prev, task]);
        setNextId(n => n + 1);
        output = `✓ Task #${nextId} created: "${args}"`;
      }
    }
    else if (op === 'done') {
      const id = parseInt(args);
      if (isNaN(id)) { output = 'Error: invalid ID'; }
      else if (!tasks.find(t => t.id === id)) { output = `Error: task #${id} not found`; }
      else { setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t)); output = `✓ Task #${id} marked complete`; }
    }
    else if (op === 'delete') {
      const id = parseInt(args);
      if (isNaN(id)) { output = 'Error: invalid ID'; }
      else if (!tasks.find(t => t.id === id)) { output = `Error: task #${id} not found`; }
      else { setTasks(prev => prev.filter(t => t.id !== id)); output = `✓ Task #${id} deleted`; }
    }
    else if (op === 'search') {
      if (!args) { output = 'Error: query required'; }
      else {
        const found = tasks.filter(t => t.title.toLowerCase().includes(args.toLowerCase()));
        output = found.length === 0 ? 'No tasks found.' : found.map(t => `[${t.done ? '✓' : ' '}] #${t.id} ${t.title}`).join('\n');
      }
    }
    else if (op === 'stats') {
      const done = tasks.filter(t => t.done).length;
      output = `Total: ${tasks.length} · Done: ${done} · Pending: ${tasks.length - done}`;
    }
    else if (op === '') { output = ''; }
    else { output = `Error: unknown command "${op}". Type "help" for available commands.`; }

    setHistory(prev => [...prev, `$ ${cmd}`, ...(output ? [output] : []), '']);
  };

  return (
    <div className="border border-border rounded-xl bg-[#0D1117] overflow-hidden font-mono text-sm">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161B22] border-b border-[#21262D]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-[#8B949E] ml-2">task-manager — bash</span>
      </div>

      {/* Output */}
      <div className="p-4 h-64 overflow-y-auto text-[#E6EDF3] text-xs leading-relaxed" onClick={() => inputRef.current?.focus()}>
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-[#3FB950]' : line.startsWith('Error') ? 'text-red-400' : line.startsWith('✓') ? 'text-[#58A6FF]' : 'text-[#8B949E]'}>
            {line || <>&nbsp;</>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[#21262D] bg-[#0D1117]">
        <span className="text-[#3FB950] text-xs">$</span>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { run(input); setInput(''); } }}
          className="flex-1 bg-transparent outline-none text-xs text-[#E6EDF3] placeholder:text-[#8B949E]"
          placeholder="Type a command..." autoComplete="off" spellCheck={false} />
      </div>
    </div>
  );
}
