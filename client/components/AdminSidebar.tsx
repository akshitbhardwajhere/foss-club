'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, LayoutDashboard, CalendarDays, Users, Rss, X, Images } from 'lucide-react';

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Events', href: '/admin/events', icon: CalendarDays },
        { label: 'Event Gallery', href: '/admin/gallery', icon: Images },
        { label: 'Members', href: '/admin/team', icon: Users },
        { label: 'Blogs', href: '/admin/blogs', icon: Rss },
        { label: 'FOSS Community', href: '/admin/queries', icon: Terminal },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div className={`fixed md:sticky top-0 left-0 w-64 bg-[#0a1410] border-r border-zinc-800/50 h-screen flex flex-col pt-6 pb-6 shadow-2xl z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Branding */}
                <div className="px-6 mb-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 rounded bg-[#08B74F]/20 flex items-center justify-center">
                                <Terminal className="w-4 h-4 text-[#08B74F]" />
                            </div>
                            <h2 className="text-white font-bold text-lg tracking-tight">FOSS NIT Srinagar</h2>
                        </div>
                        <p className="text-[#08B74F] text-xs font-semibold pl-11">Admin Panel</p>
                    </div>
                    <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 min-h-0 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                    {navItems.map((item) => {
                        const isActive = pathname?.startsWith(item.href) ||
                            (pathname?.startsWith('/admin/events') && item.label === 'Events') ||
                            (pathname?.startsWith('/admin/team') && item.label === 'Members');

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? 'bg-[#08B74F]/10 text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#08B74F]' : 'text-zinc-500'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
