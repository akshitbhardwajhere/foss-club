'use client';

// usePathname allows us to inspect the client-side active route path dynamically
import { usePathname } from 'next/navigation';
// Public Header component with navigation links
import Header from "@/components/Header";
// Redux StoreProvider context wrapper
import StoreProvider from "./StoreProvider";
// Premium hover custom cursor trail
import CustomCursor from "@/components/CustomCursor";
// Framer motion wrapper to animate page entries/exits
import PageTransition from "@/components/PageTransition";
// Public Footer component with git link and credits
import Footer from "@/components/Footer";

/**
 * ProvidersAndLayout Component
 * 
 * Serves as the primary client-side wrapper orchestrating global context providers (Redux).
 * Also injects the shared Header, Footer, CustomCursor, and Framer Motion PageTransitions.
 * Intelligently suppresses the public Header/Footer when navigating within the `/admin` area.
 *
 * @param {Object} props - React children node.
 */
export default function ProvidersAndLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Detect if we are inside the admin panel space. Admin views use their own layouts
    // and should not display public navigation or footer bars.
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        // Provide the Redux Toolkit store to all descendants
        <StoreProvider>
            {/* Custom interactive mouse cursor effect */}
            <CustomCursor />
            {/* Flex container set to fill min-screen height so footer sticks to bottom */}
            <div className="flex flex-col min-h-screen">
                {/* Render public Header only if not on an admin page */}
                {!isAdminRoute && <Header />}
                {/* Main content slot; flex-grow pushes layout elements apart */}
                <main className="flex-grow">
                    {/* Add smooth animated transitions to inner router page render */}
                    <PageTransition>{children}</PageTransition>
                </main>
                {/* Render public Footer only if not on an admin page */}
                {!isAdminRoute && <Footer />}
            </div>
        </StoreProvider>
    );
}
