import { useState, useRef, useEffect } from 'react';
import { virtualFS } from '../lib/virtualFS';

type FileNode = {
  type: 'file';
  content: string;
};
type PathArr = string[];

function getPathString(pathArr: PathArr): string {
  const base = 'guest@PTP-SV';
  const path = pathArr.join('/');
  return `${base}/${path ? path : ''}`;
}

const helpText = `Available commands:\nls, cd <dir>, cat <file>, help, clear`;

export default function HiddenCLI() {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<PathArr>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const args = input.split(/\s+/);
        if (args.length > 1) {
            const partial = args[args.length - 1];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let node: any = virtualFS['/'];
            for (const part of cwd) {
                if (node.type !== 'dir' || !(part in node.children)) {
                   node = null;
                   break;
                }
                node = node.children[part];
            }

            if (node && node.type === 'dir') {
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 const candidates = Object.keys((node as any).children).filter(name => name.startsWith(partial));
                 if (candidates.length === 1) {
                     const newArgs = [...args];
                     newArgs[newArgs.length - 1] = candidates[0];
                     setInput(newArgs.join(' '));
                 }
            }
        } else if (args.length === 1 && args[0].length > 0) {
             const commands = ['ls', 'cd', 'cat', 'help', 'clear'];
             const partial = args[0];
             const candidates = commands.filter(c => c.startsWith(partial));
             if (candidates.length === 1) {
                 setInput(candidates[0] + ' ');
             }
        }
    } else if (e.key === 'Enter') {
        const cmd = input.trim();
        if(!cmd) return;

        const args = cmd.split(/\s+/);
        const command = args[0];
        let output = '';

        // walk down to current directory
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let node: any = virtualFS['/'];
        let validPath = true;
        for (const part of cwd) {
            if (node.type !== 'dir' || !(part in node.children)) {
               validPath = false;
               break;
            }
            node = node.children[part];
        }

        if (!validPath) {
             output = 'Filesystem error.';
        } else if (command === 'ls') {
             if (node.type !== 'dir') output = 'Not a directory.';
             else {
                 const showAll = args.includes('-a');
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 const children = Object.keys((node as any).children);
                 const visible = children.filter(name => showAll || !name.startsWith('.'));
                 output = visible.join('  ');
             }
        } else if (command === 'cd') {
             if (!args[1]) output = 'Usage: cd <dir>';
             else {
                 const target = args[1].endsWith('/') ? args[1].slice(0, -1) : args[1];
                 if (target === '..' || target === '../') {
                     if (cwd.length > 0) setCwd(cwd.slice(0, -1));
                 } else if (target === '.') {
                 } else if (
                    node.type === 'dir' &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (node as any).children[target] &&
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (node as any).children[target].type === 'dir'
                 ) {
                    setCwd([...cwd, target]);
                 } else output = 'No such directory.';
             }
        } else if (command === 'cat') {
             if (!args[1]) output = 'Usage: cat <file>';
             else if (
                node.type === 'dir' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (node as any).children[args[1]] &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (node as any).children[args[1]].type === 'file'
             ) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                output = ((node as any).children[args[1]] as FileNode).content;
             } else output = 'No such file.';
        } else if (command === 'help') {
             output = helpText;
        } else if (command === 'clear') {
             setHistory([]);
             setInput('');
             return;
        } else {
             output = 'Unknown command.';
        }

        setHistory(h => [...h, `${getPathString(cwd)} $ ${cmd}`, output]);
        setInput('');
    }
  }

  return (
    <div className="bg-black text-green-400 font-mono p-4 rounded-lg min-h-75 max-w-full overflow-auto" onClick={() => inputRef.current?.focus()}>
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      <div className="flex">
        <span className="mr-2 whitespace-nowrap">{getPathString(cwd)} $</span>
        <input
          ref={inputRef}
          className="bg-black text-green-400 outline-none flex-1 w-full"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
