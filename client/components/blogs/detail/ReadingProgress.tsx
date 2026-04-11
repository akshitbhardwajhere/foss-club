"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.75 z-50">
      <div
        className="h-full bg-linear-to-r from-[#08B74F] via-[#0ED966] to-[#08B74F] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(8,183,79,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
