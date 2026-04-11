"use client";

import { GraduationCap } from "lucide-react";
import Image from "next/image";
import MemberSocialLinks from "./MemberSocialLinks";
import type { SocialLink, TeamMember } from "./types";

interface TeamMemberDesktopCardProps {
  member: TeamMember;
  avatarSrc: string;
  priority?: boolean;
  isAlumni: boolean;
  colorTheme: string;
  textTheme: string;
  shadowTheme: string;
  socialLinks: SocialLink[];
}

export default function TeamMemberDesktopCard({
  member,
  avatarSrc,
  priority,
  isAlumni,
  colorTheme,
  textTheme,
  shadowTheme,
  socialLinks,
}: TeamMemberDesktopCardProps) {
  return (
    <div
      className={`hidden sm:flex w-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/50 rounded-[2rem] p-8 flex-col items-center group hover:border-${colorTheme}/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_${shadowTheme}] transition-all duration-500 overflow-hidden relative`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-b from-${colorTheme}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <div className="w-44 h-44 rounded-full bg-zinc-800 p-2 mb-6 relative z-10 group-hover:scale-105 transition-transform duration-300">
        <Image
          src={avatarSrc}
          alt={member.name}
          width={352}
          height={352}
          className="w-full h-full rounded-full object-cover bg-zinc-950"
          style={{ imageRendering: "auto" }}
          priority={priority}
        />
      </div>

      <h3 className="text-xl font-bold mb-1 relative z-10 text-center text-white">
        {member.name}
      </h3>
      <p
        className={`${textTheme} font-medium relative z-10 text-center ${member.company ? "mb-1" : "mb-6"} inline-flex items-center gap-1`}
      >
        {isAlumni && <GraduationCap className="w-4 h-4" />} {member.role}
      </p>
      {member.company && (
        <p className="text-zinc-400 text-sm mb-6 relative z-10 text-center">
          @ {member.company}
        </p>
      )}

      <div className="flex gap-4 relative z-10">
        <MemberSocialLinks
          links={socialLinks}
          iconSize={20}
          buttonClassName="w-10 h-10 rounded-full bg-zinc-950 flex items-center justify-center transition-colors"
        />
      </div>
    </div>
  );
}
