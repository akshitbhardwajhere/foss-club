"use client";

import { motion } from "framer-motion";
import { ensureUrl } from "@/lib/utils";
import TeamMemberDesktopCard from "./team-member-card/TeamMemberDesktopCard";
import TeamMemberMobileCard from "./team-member-card/TeamMemberMobileCard";
import type { SocialLink, TeamMemberCardProps } from "./team-member-card/types";

export default function TeamMemberCard({
  member,
  itemVariants,
  priority,
}: TeamMemberCardProps) {
  const avatarSrc =
    member.imageUrl ||
    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${member.name}`;
  const firstName = member.name.split(" ")[0];
  const isAlumni =
    !!member.company ||
    member.role.toLowerCase().includes("alumni") ||
    member.role.toLowerCase().includes("former");
  const colorTheme = isAlumni ? "yellow-500" : "[#08B74F]";
  const textTheme = isAlumni ? "text-yellow-500" : "text-[#08B74F]";
  const shadowTheme = isAlumni ? "rgba(234,179,8,0.1)" : "rgba(8,183,79,0.1)";
  const codeLines = [
    `const member = ${JSON.stringify(member.name)};`,
    `const role = ${JSON.stringify(member.role)};`,
    member.company
      ? `const org = ${JSON.stringify(member.company)};`
      : 'const mode = "build";',
    isAlumni ? "git checkout legacy && yarn story" : "npm run innovate",
  ];
  const socialLinks: SocialLink[] = [
    member.githubUrl && {
      href: ensureUrl(member.githubUrl),
      platform: "github",
      title: "GitHub profile",
      hoverClassName: "text-zinc-400 hover:text-white hover:bg-zinc-800",
    },
    member.linkedinUrl && {
      href: ensureUrl(member.linkedinUrl),
      platform: "linkedin",
      title: "LinkedIn profile",
      hoverClassName: "text-zinc-400 hover:text-[#0A66C2] hover:bg-zinc-800",
    },
    member.twitterUrl && {
      href: ensureUrl(member.twitterUrl),
      platform: "twitter",
      title: "X profile",
      hoverClassName: "text-zinc-400 hover:text-sky-500 hover:bg-zinc-800",
    },
  ].filter((social): social is SocialLink => Boolean(social));

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="w-full flex justify-center"
    >
      <TeamMemberDesktopCard
        member={member}
        avatarSrc={avatarSrc}
        priority={priority}
        isAlumni={isAlumni}
        colorTheme={colorTheme}
        textTheme={textTheme}
        shadowTheme={shadowTheme}
        socialLinks={socialLinks}
      />

      <TeamMemberMobileCard
        member={member}
        avatarSrc={avatarSrc}
        firstName={firstName}
        priority={priority}
        isAlumni={isAlumni}
        textTheme={textTheme}
        codeLines={codeLines}
        socialLinks={socialLinks}
      />
    </motion.div>
  );
}
