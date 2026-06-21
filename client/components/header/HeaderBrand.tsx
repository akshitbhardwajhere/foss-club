"use client";

import Link from "next/link";
import Image from "next/image";

export default function HeaderBrand() {
  return (
    <Link href="/" className="flex items-center gap-3 group z-10 shrink-0">
      <div className="w-10 h-10 rounded-full  flex items-center justify-center  group-hover:scale-110 transition-transform duration-300 overflow-hidden">
        <Image
          src="/icon.png"
          alt="FOSS Logo"
          width={38}
          height={38}
          className="object-cover"
        />
      </div>
      <div className="flex gap-3 text-xl font-bold tracking-widest text-white group-hover:text-[#08B74F] transition-colors duration-300">
        <div className="flex items-center justify-center w-fit">
          <p>FOSS</p>
        </div>
        <div className="flex flex-col -space-y-2 border-l-2 border-zinc-300 px-2">
          <p className="text-zinc-500">NIT</p>
          <p className="text-zinc-500">SRINAGAR</p>
        </div>
      </div>
    </Link>
  );
}
