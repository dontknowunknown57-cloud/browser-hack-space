import { useEffect, useMemo, useState } from "react";
import { DesktopWindow } from "@/components/desktop/Window";
import TerminalApp from "@/apps/TerminalApp";
import CodeEditorApp from "@/apps/CodeEditorApp";
import { Code2, TerminalSquare } from "lucide-react";
import Taskbar from "./Taskbar";

export type AppType = 'terminal' | 'editor';

type Win = {
  id: string;
  type: AppType;
  title: string;
  x: number; y: number; width: number; height: number;
  z: number; minimized?: boolean;
};

let zTop = 10;

export default function WindowManager() {
  const [wins, setWins] = useState<Win[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (wins.length === 0) open('terminal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = (type: AppType) => {
    const id = `${type}-${Date.now()}`;
    const base = type === 'terminal' ? { width: 640, height: 420 } : { width: 820, height: 520 };
    const win: Win = {
      id, type,
      title: type === 'terminal' ? 'Terminal' : 'Code Editor',
      x: 60 + Math.random() * 40, y: 60 + Math.random() * 40,
      width: base.width, height: base.height,
      z: ++zTop,
    };
    setWins((w) => [...w, win]);
    setActive(id);
  };

  const close = (id: string) => setWins((w) => w.filter(win => win.id !== id));
  const minimize = (id: string) => setWins((w) => w.map(win => win.id === id ? { ...win, minimized: !win.minimized } : win));
  const focus = (id: string) => {
    setWins((w) => w.map(win => win.id === id ? { ...win, z: ++zTop } : win));
    setActive(id);
  };
  const move = (id: string, x: number, y: number) => setWins((w) => w.map(win => win.id === id ? { ...win, x, y } : win));
  const resize = (id: string, width: number, height: number) => setWins((w) => w.map(win => win.id === id ? { ...win, width, height } : win));

  const icons = useMemo(() => ([
    { id: 'i-terminal', label: 'Terminal', icon: <TerminalSquare className="h-8 w-8" />, action: () => open('terminal') },
    { id: 'i-editor', label: 'Code Editor', icon: <Code2 className="h-8 w-8" />, action: () => open('editor') },
  ]), []);

  return (
    <div className="relative w-full h-full">
      {/* Desktop shortcuts */}
      <div className="absolute top-4 left-4 grid gap-6 animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
        {icons.map((i) => (
          <button key={i.id} onDoubleClick={i.action} className="flex flex-col items-center gap-2 hover-scale group">
            <div className="p-3 rounded-lg border card-modern group-hover:bg-brand/15 group-hover:border-brand/60 transition-all duration-300 group-hover:glow-effect group-hover:animate-pulse-glow">
              {i.icon}
            </div>
            <div className="text-xs text-center max-w-[100px] group-hover:text-brand transition-colors duration-300 group-hover:text-glow">
              {i.label}
            </div>
          </button>
        ))}
      </div>

      {/* Windows */}
      {wins.map((w) => (
        <DesktopWindow
          key={w.id}
          id={w.id}
          title={w.title}
          x={w.x}
          y={w.y}
          width={w.width}
          height={w.height}
          zIndex={w.z}
          minimized={w.minimized}
          onFocus={focus}
          onClose={close}
          onMinimize={minimize}
          onDragStop={move}
          onResizeStop={resize}
        >
          {w.type === 'terminal' ? <TerminalApp /> : <CodeEditorApp />}
        </DesktopWindow>
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0">
        <Taskbar
          windows={wins}
          activeId={active}
          onToggleMin={minimize}
          launchTerminal={() => open('terminal')}
          launchEditor={() => open('editor')}
        />
      </div>
    </div>
  );
}
