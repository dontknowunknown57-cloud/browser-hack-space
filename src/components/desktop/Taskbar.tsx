import { useEffect, useState } from "react";
import { Code2, MonitorCog, SunMoon, TerminalSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { useRetroMode } from "@/hooks/useRetroMode";

type TaskbarProps = {
  windows: { id: string; title: string; minimized?: boolean }[];
  activeId: string | null;
  onToggleMin: (id: string) => void;
  launchTerminal: () => void;
  launchEditor: () => void;
};

export default function Taskbar(props: TaskbarProps) {
  const { theme, setTheme } = useTheme();
  const { retro, toggleRetro } = useRetroMode();
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-4 mb-4 rounded-xl border bg-card/80 backdrop-blur-md shadow-lg shadow-brand/10 animate-slide-in-bottom">
      <div className="flex items-center gap-3 px-3 py-2">
        <button onClick={props.launchTerminal} className="hover-scale rounded-md px-2 py-1 border hover:border-brand/50 hover:bg-brand/10 transition-all duration-200" aria-label="Launch Terminal">
          <TerminalSquare className="h-4 w-4" />
        </button>
        <button onClick={props.launchEditor} className="hover-scale rounded-md px-2 py-1 border hover:border-brand/50 hover:bg-brand/10 transition-all duration-200" aria-label="Launch Code Editor">
          <Code2 className="h-4 w-4" />
        </button>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
          {props.windows.map((w) => (
            <button
              key={w.id}
              onClick={() => props.onToggleMin(w.id)}
              className={`px-3 py-1 rounded-md border transition-all duration-200 hover-scale ${
                props.activeId === w.id && !w.minimized 
                  ? 'bg-brand/20 border-brand/50 text-brand' 
                  : 'bg-background/40 hover:bg-brand/10 hover:border-brand/30'
              }`}
              title={w.title}
            >
              {w.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover-scale rounded-md px-2 py-1 border hover:border-brand/50 hover:bg-brand/10 transition-all duration-200"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <SunMoon className="h-4 w-4" />
          </button>
          <button
            onClick={toggleRetro}
            className={`hover-scale rounded-md px-2 py-1 border transition-all duration-200 ${
              retro 
                ? 'bg-brand/20 border-brand/50 text-brand' 
                : 'hover:border-brand/50 hover:bg-brand/10'
            }`}
            aria-label="Toggle retro mode"
            title="Retro-Futurism Mode"
          >
            <MonitorCog className="h-4 w-4" />
          </button>
          <div className="text-xs tabular-nums text-muted-foreground min-w-[70px] text-right font-mono">
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}
