import { Rnd } from "react-rnd";
import { ReactNode, useCallback } from "react";
import { X, Minus } from "lucide-react";

export type WindowProps = {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized?: boolean;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onDragStop: (id: string, x: number, y: number) => void;
  onResizeStop: (id: string, width: number, height: number) => void;
  children: ReactNode;
};

export function DesktopWindow(props: WindowProps) {
  const {
    id, title, x, y, width, height, zIndex, minimized,
    onFocus, onClose, onMinimize, onDragStop, onResizeStop, children
  } = props;

  const handleFocus = useCallback(() => onFocus(id), [id, onFocus]);

  if (minimized) return null;

  return (
    <Rnd
      default={{ x, y, width, height }}
      bounds="parent"
      minWidth={320}
      minHeight={200}
      style={{ zIndex }}
      onMouseDown={handleFocus}
      onDragStop={(e, d) => onDragStop(id, d.x, d.y)}
      onResizeStop={(e, dir, ref, delta, position) => {
        onResizeStop(id, ref.offsetWidth, ref.offsetHeight);
        onDragStop(id, position.x, position.y);
      }}
      className="glass-surface rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:shadow-brand/20 transition-all duration-300 animate-slide-in-bottom"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-background/60 backdrop-blur-sm">
        <div className="font-medium select-none truncate pr-2">{title}</div>
        <div className="flex items-center gap-2">
          <button 
            aria-label="Minimize" 
            onClick={() => onMinimize(id)} 
            className="hover-scale rounded-md px-2 py-1 border border-border hover:border-brand/50 hover:bg-brand/10 transition-all duration-200"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button 
            aria-label="Close" 
            onClick={() => onClose(id)} 
            className="hover-scale rounded-md px-2 py-1 border border-border hover:border-destructive/50 hover:bg-destructive/10 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-[calc(100%-44px)] bg-card">{children}</div>
    </Rnd>
  );
}
