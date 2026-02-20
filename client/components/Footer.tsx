export default function Footer() {
    return (
        <footer className="w-full bg-[#050B08] border-t border-zinc-900/50 py-8 relative z-10">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4 justify-center text-center">
                <p className="text-zinc-500 font-medium text-sm">
                    Designed with <span className="text-red-500">{"\u2764"}</span> by the FOSS Team.
                </p>
            </div>
        </footer>
    );
}
