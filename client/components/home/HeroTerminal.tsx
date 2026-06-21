"use client";

import { useEffect, useRef, useState } from "react";

const TERMINAL_LINES = [
  { text: "$ git clone https://github.com/akshitbhardwajhere/foss-club", type: "cmd" },
  { text: "Cloning into 'foss-club'... done.", type: "output" },
  { text: "$ cd foss-club && npm install", type: "cmd" },
  { text: "✓ 247 packages installed in 3.2s", type: "success" },
  { text: "$ npm run dev", type: "cmd" },
  { text: "▲ Next.js ready at http://localhost:3000", type: "success" },
  { text: "$ open-source --contribute --collaborate", type: "cmd" },
  { text: "// Welcome to FOSS Club NIT Srinagar 🚀", type: "comment" },
];

const typeColors: Record<string, string> = {
  cmd: "text-white",
  output: "text-zinc-400",
  success: "text-[#08B74F]",
  comment: "text-zinc-500 italic",
};

export default function HeroTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentChar, setCurrentChar] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive completion state dynamically to avoid synchronous state transitions inside useEffect
  const done = visibleLines >= TERMINAL_LINES.length;

  useEffect(() => {
    if (done) return;

    const line = TERMINAL_LINES[visibleLines];
    const isTyping = visibleLines < TERMINAL_LINES.length;

    if (isTyping && currentChar < line.text.length) {
      timeoutRef.current = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, line.type === "cmd" ? 28 : 8);
    } else if (currentChar >= line.text.length) {
      timeoutRef.current = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCurrentChar(0);
      }, line.type === "cmd" ? 180 : 60);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visibleLines, currentChar, done]);

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-zinc-800/70 bg-zinc-950/80 backdrop-blur-md shadow-[0_0_60px_rgba(8,183,79,0.08)] text-left">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/60 bg-zinc-900/60">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-[#08B74F]/80" />
        <span className="ml-3 text-xs text-zinc-500 font-mono tracking-widest uppercase">foss-club — bash</span>
      </div>

      {/* Terminal body */}
      <div className="px-5 py-4 font-mono text-sm leading-relaxed min-h-[200px]">
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <p key={i} className={typeColors[line.type]}>
            {line.text}
          </p>
        ))}

        {/* Currently typing line */}
        {!done && (
          <p className={typeColors[TERMINAL_LINES[visibleLines].type]}>
            {TERMINAL_LINES[visibleLines].text.slice(0, currentChar)}
            <span className="inline-block w-2 h-4 bg-[#08B74F] ml-0.5 align-middle animate-pulse" />
          </p>
        )}

        {done && (
          <p className="text-zinc-600 mt-1">
            <span className="text-[#08B74F]">$</span>{" "}
            <span className="inline-block w-2 h-4 bg-[#08B74F]/60 ml-0.5 align-middle animate-pulse" />
          </p>
        )}
      </div>
    </div>
  );
}
