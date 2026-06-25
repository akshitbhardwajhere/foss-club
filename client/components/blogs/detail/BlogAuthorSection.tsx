"use client";

interface BlogAuthorSectionProps {
  author: string;
  tags?: string[];
}

export default function BlogAuthorSection({
  author,
  tags = [],
}: BlogAuthorSectionProps) {
  return (
    <footer className="mt-16 pt-10 border-t border-zinc-800/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-semibold text-[#08B74F]">
              {author.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -inset-0.5 rounded-full border border-[#08B74F]/20 pointer-events-none" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
              Author
            </p>
            <p className="text-lg font-semibold text-white tracking-tight">
              {author}
            </p>
            <p className="text-sm text-zinc-500 mt-0.5">
              FOSS Club NIT Srinagar
            </p>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="sm:ml-auto flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-zinc-400 tracking-wide px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
