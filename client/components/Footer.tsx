import { Github, Heart } from "lucide-react";

/**
 * Footer Component
 * 
 * The global standard footer injected at the bottom of the public-facing application pages.
 */
export default function Footer() {
    return (
        <footer className="w-full bg-[#050B08] border-t border-zinc-900/50 py-8 relative z-10">
            <div className="container mx-auto px-6 flex flex-col items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/akshitbhardwajhere/foss-club"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-[#08B74F] text-sm font-semibold transition-colors duration-200 flex items-center gap-2 group"
                    >
                        <Github className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        <span>Contribute on GitHub</span>
                    </a>
                </div>
                <p className="text-zinc-500 font-medium text-sm flex items-center gap-1.5">
                    Designed with
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse inline-block" />
                    by the FOSS Team.
                </p>
            </div>
        </footer>
    );
}

