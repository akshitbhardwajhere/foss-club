'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/store';
import { checkAuth } from '@/lib/features/authSlice';
import { Terminal, Menu } from 'lucide-react';

import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
    const [isMounted, setIsMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Dispatch checkAuth on mount. It hits /api/admin/me
        // and either hydrates user state from the HttpOnly cookie or fails securely.
        if (!isAuthenticated) {
            dispatch(checkAuth());
        }
    }, [dispatch, isAuthenticated]);

    const publicAdminPaths = ['/admin/login', '/admin'];

    useEffect(() => {
        // Only run this logic on the client side after the component mounts
        if (isMounted && !loading) {
            if (!isAuthenticated && !publicAdminPaths.includes(pathname)) {
                router.push('/admin');
            } else if (isAuthenticated && publicAdminPaths.includes(pathname)) {
                router.push('/admin/dashboard');
            }
        }
    }, [isAuthenticated, loading, pathname, router, isMounted]);

    // Prevent rendering the page while checking auth status to avoid flashing
    if (!isMounted || loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Terminal className="w-10 h-10 text-[#08B74F] animate-pulse" />
            </div>
        );
    }

    // Still validating redirect execution frame
    if (
        (isAuthenticated && pathname === '/admin/login') ||
        (!isAuthenticated && !publicAdminPaths.includes(pathname))
    ) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center z-50">
                <div className="w-8 h-8 rounded-full border-2 border-[#08B74F] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (publicAdminPaths.includes(pathname)) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white selection:bg-[#08B74F] selection:text-black">
                {children}
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-[#08120c] text-white selection:bg-[#08B74F] selection:text-black overflow-hidden relative">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#0a1410] z-30 sticky top-0 shadow-lg">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-[#08B74F]" />
                        <h2 className="text-white font-bold text-lg tracking-tight">FOSS Admin</h2>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-400 hover:text-white transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <main className="flex-1 overflow-y-auto overflow-x-hidden relative outline-none" tabIndex={-1}>
                    {children}
                </main>
            </div>
        </div>
    );
}
