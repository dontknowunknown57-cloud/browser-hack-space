import WindowManager from "@/components/desktop/WindowManager";
import { useTheme } from "next-themes";
import { useRetroMode } from "@/hooks/useRetroMode";

export default function Desktop() {
  const { theme } = useTheme();
  const { retro } = useRetroMode();
  const background = theme === 'dark' ? 'bg-obsidian' : 'bg-aurora';

  return (
    <div className={`relative min-h-screen ${background} animate-fade-in`}>
      {retro && <div className="scanline-overlay absolute inset-0 opacity-60" aria-hidden="true" />}
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-brand-2/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-brand/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-brand-2/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <main className="relative h-screen">
        <WindowManager />
      </main>
    </div>
  );
}
