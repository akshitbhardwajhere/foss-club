"use client";

const COLORS = [
  "#ffffff",
  "#a1a1aa",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#08B74F",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

interface ColorPickerProps {
  currentColor?: string;
  onSelectColor: (color: string) => void;
  onClearColor: () => void;
}

export default function ColorPicker({
  currentColor,
  onSelectColor,
  onClearColor,
}: ColorPickerProps) {
  return (
    <div className="relative group/color">
      <button
        type="button"
        title="Text Color"
        className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition-all cursor-pointer"
      >
        <span
          className="text-base font-bold leading-none"
          style={{ color: currentColor || "#a1a1aa" }}
        >
          A
        </span>
        <span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
          style={{ backgroundColor: currentColor || "#a1a1aa" }}
        />
      </button>
      <div className="absolute top-full left-0 mt-1 hidden group-hover/color:flex flex-wrap gap-1 p-2 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 w-[140px]">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelectColor(color)}
            className="w-5 h-5 rounded-full border border-zinc-600 hover:scale-125 transition-transform cursor-pointer"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
        <button
          type="button"
          onClick={onClearColor}
          className="w-5 h-5 rounded-full border border-zinc-600 hover:scale-125 transition-transform cursor-pointer flex items-center justify-center text-[9px] text-zinc-400 bg-zinc-900"
          title="Reset color"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
