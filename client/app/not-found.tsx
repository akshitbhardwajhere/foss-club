import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * NotFound Component
 * 
 * The default 404 fallback page displayed automatically by Next.js when a requested route does not exist.
 * Provides a simple call-to-action to return to the homepage.
 */
export default function NotFound() {
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-400 mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link href="/">
        <Button className="bg-[#08B74F] hover:bg-[#08B74F]">Return Home</Button>
      </Link>
    </div>
  );
}
