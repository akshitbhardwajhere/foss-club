"use client";

import { Crown, GraduationCap } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TeamMemberMobileDialog from "./TeamMemberMobileDialog";
import type { SocialLink, TeamMember } from "./types";

interface TeamMemberMobileCardProps {
  member: TeamMember;
  avatarSrc: string;
  firstName: string;
  priority?: boolean;
  isAlumni: boolean;
  textTheme: string;
  codeLines: string[];
  socialLinks: SocialLink[];
}

export default function TeamMemberMobileCard({
  member,
  avatarSrc,
  firstName,
  priority,
  isAlumni,
  textTheme,
  codeLines,
  socialLinks,
}: TeamMemberMobileCardProps) {
  return (
    <div className="flex sm:hidden w-full">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center gap-2 cursor-pointer w-full group relative">
            <div className="w-full aspect-square rounded-2xl bg-zinc-800 p-0.75 relative ring-0 transition-all">
              {member.role === "Team Lead" && (
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-yellow-500 rounded-full border-[3px] border-zinc-950 flex items-center justify-center z-30 -rotate-45 shadow-lg">
                  <Crown className="w-5 h-5 text-zinc-950 fill-zinc-950" />
                </div>
              )}
              <Image
                src={avatarSrc}
                alt={member.name}
                fill
                sizes="25vw"
                className="rounded-[10px] object-cover bg-zinc-950"
                style={{ imageRendering: "auto" }}
                priority={priority}
              />
              {isAlumni && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-yellow-500 rounded-full border border-black flex items-center justify-center z-20">
                  <GraduationCap className="w-3 h-3 text-black" />
                </div>
              )}
            </div>

            <p className="text-zinc-200 text-xs sm:text-sm font-semibold text-center truncate w-full group-hover:text-white transition-colors">
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
