"use client";

import { Crown, GraduationCap } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TeamMemberMobileDialog from "./TeamMemberMobileDialog";
import type { SocialLink, TeamMember } from "./types";

interface TeamMemberMobileCardProps {
  id?: string;
  member: TeamMember;
  avatarSrc: string;
  firstName: string;
  priority?: boolean;
  isAlumni: boolean;
  textTheme: string;
  codeLines: string[];
  socialLinks: SocialLink[];
  className?: string;
}

export default function TeamMemberMobileCard({
  id,
  member,
  avatarSrc,
  firstName,
  priority,
  isAlumni,
  textTheme,
  codeLines,
  socialLinks,
  className = "flex sm:hidden",
}: TeamMemberMobileCardProps) {
  return (
    <div id={id} className={`${className} w-full max-w-32 justify-self-center`}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center gap-0.5 cursor-pointer w-full group relative">
            <div className="w-full aspect-square rounded-4xl bg-zinc-800 p-0.5 relative ring-0 transition-all">
              {member.role === "Team Lead" && (
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full border-[3px] border-zinc-950 flex items-center justify-center z-30 -rotate-45 shadow-lg">
                  <Crown className="w-3 h-3 text-zinc-950 fill-zinc-950" />
                </div>
              )}
              <Image
                src={avatarSrc}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 24vw, 128px"
                className="rounded-lg object-cover bg-zinc-950"
                style={{ imageRendering: "auto" }}
                priority={priority}
              />
              {isAlumni && (
                <div className="absolute bottom-1 right-1 w-3 h-3 bg-yellow-500 rounded-full border border-black flex items-center justify-center z-20">
                  <GraduationCap className="w-1.5 h-1.5 text-black" />
                </div>
              )}
            </div>

            <p className="text-zinc-200 text-[9px] sm:text-[10px] font-semibold text-center truncate w-full group-hover:text-white transition-colors">
              {firstName}
            </p>
          </div>
        </DialogTrigger>

        <TeamMemberMobileDialog
          member={member}
          avatarSrc={avatarSrc}
          isAlumni={isAlumni}
          textTheme={textTheme}
          codeLines={codeLines}
          socialLinks={socialLinks}
        />
      </Dialog>
    </div>
  );
}
