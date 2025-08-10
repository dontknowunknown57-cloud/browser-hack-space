import WindowManager from "@/components/desktop/WindowManager";
import { useTheme } from "next-themes";
import { useRetroMode } from "@/hooks/useRetroMode";

export default function Desktop() {
  const { theme } = useTheme();
  const { retro } = useRetroMode();
  const background = theme === 'dark' ? 'bg-obsidian' : 'bg-aurora';

  return (
    <div className={`relative min-h-screen ${background}`}>
      {retro && <div className="scanline-overlay absolute inset-0 opacity-60" aria-hidden="true" />}
      <main className="relative h-screen">
        <WindowManager />
      </main>
    </div>
  );
}
