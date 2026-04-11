"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeaderBrand() {
  return (
    <Link href="/" className="flex items-center gap-3 group z-10 shrink-0">
      <div className="w-10 h-10 rounded-full bg-[#08B74F]/10 border border-[#08B74F]/20 flex items-center justify-center text-[#08B74F] group-hover:scale-110 transition-transform duration-300 overflow-hidden">
        <Image
          src="/icon.png"
          alt="FOSS Logo"
          width={38}
          height={38}
          className="object-cover"
        />
      </div>
      <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#08B74F] transition-colors duration-300">
        FOSS <span className="text-zinc-500 font-medium">NIT Srinagar</span>
      </span>
    </Link>
  );
}
