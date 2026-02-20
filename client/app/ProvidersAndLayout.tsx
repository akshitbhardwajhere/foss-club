'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import StoreProvider from "./StoreProvider";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

export default function ProvidersAndLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Do not render the global public Header on admin routes
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <StoreProvider>
            <CustomCursor />
            <div className="flex flex-col min-h-screen">
                {!isAdminRoute && <Header />}
                <main className="flex-grow">
                    <PageTransition>{children}</PageTransition>
                </main>
                {!isAdminRoute && <Footer />}
            </div>
        </StoreProvider>
    );
}
