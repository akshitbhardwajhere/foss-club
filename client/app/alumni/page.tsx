"use client";

import { useEffect, useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import api from "@/lib/axios";
import { getStaggeredMotionPresets } from "@/lib/motion";
import RosterPageLayout from "@/components/shared/RosterPageLayout";
import AlumniMemberCard from "@/components/cards/team-member-card/AlumniMemberCard";
import TeamPageSkeleton from "@/components/skeletons/TeamPageSkeleton";
import { ensureUrl } from "@/lib/utils";
import type {
  SocialLink,
  TeamMember,
} from "@/components/cards/team-member-card/types";

/**
 * AlumniPage Component
 *
 * The public roster displaying all FOSS club alumni.
 * Fetches data asynchronously from the `/api/alumni` endpoint.
 * Layout aligns perfectly with the Team page design, featuring a Left Stats panel
 * and a Right Roster grid.
 */
export default function AlumniPage() {
  const [alumni, setAlumni] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { containerVariants, itemVariants } = getStaggeredMotionPresets();

  const isAlumniMember = (member: TeamMember) =>
    !!member.company ||
    member.role.toLowerCase().includes("alumni") ||
    member.role.toLowerCase().includes("former");

  const buildCardData = (member: TeamMember) => {
    const avatarSrc =
      member.imageUrl ||
      `https://api.dicebear.com/9.x/pixel-art/svg?seed=${member.name}`;
    const isAlumni = isAlumniMember(member);
    const textTheme = isAlumni ? "text-yellow-500" : "text-[#08B74F]";
    const codeLines = [
      `const member = ${JSON.stringify(member.name)};`,
      `const role = ${JSON.stringify(member.role)};`,
      member.company
        ? `const org = ${JSON.stringify(member.company)};`
        : 'const mode = "build";',
      isAlumni ? "git checkout legacy && yarn story" : "npm run innovate",
    ];
    const socialLinks = [
      member.githubUrl && {
        href: ensureUrl(member.githubUrl),
        platform: "github" as const,
        title: "GitHub profile",
        hoverClassName: "text-zinc-400 hover:text-white hover:bg-zinc-800",
      },
      member.linkedinUrl && {
        href: ensureUrl(member.linkedinUrl),
        platform: "linkedin" as const,
        title: "LinkedIn profile",
        hoverClassName: "text-zinc-400 hover:text-[#0A66C2] hover:bg-zinc-800",
      },
      member.twitterUrl && {
        href: ensureUrl(member.twitterUrl),
        platform: "twitter" as const,
        title: "X profile",
        hoverClassName: "text-zinc-400 hover:text-sky-500 hover:bg-zinc-800",
      },
    ].filter((link): link is SocialLink => Boolean(link));

    return { avatarSrc, isAlumni, textTheme, codeLines, socialLinks };
  };

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await api.get("/api/alumni");
        setAlumni(response.data);
      } catch (error) {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  const uniqueCompaniesCount = useMemo(() => {
    return new Set(
      alumni
        .map((a) => a.company?.trim())
        .filter(Boolean)
    ).size;
  }, [alumni]);

  return (
    <RosterPageLayout
      badge={
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-500 text-sm font-medium">
          <GraduationCap className="w-4 h-4" /> Hall of Fame
        </div>
      }
      title={
        <>
          Our{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600">
            Alumni
          </span>
        </>
      }
      containerVariants={containerVariants}
      itemVariants={itemVariants}
    >
      <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/30 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: Info / Stats panel */}
          <div className="flex flex-col justify-center gap-6 border-b border-zinc-800 p-6 lg:border-b-0 lg:border-r md:p-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-zinc-500">
                Alumni
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Our alumni
                <br />
                Shaping the future
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                The trailblazers who built the foundation of FOSS Club NIT Srinagar. See where our past members are making an impact today.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/60 p-5 shadow-inner">
              <div className="grid grid-cols-2 divide-x divide-zinc-800 text-center">
                <div className="pr-4">
                  <p className="text-3xl font-black text-yellow-500">{alumni.length}</p>
                  <p className="mt-1 text-sm text-zinc-300">Total Alumni</p>
                </div>
                <div className="pl-4">
                  <p className="text-3xl font-black text-yellow-500">{uniqueCompaniesCount}</p>
                  <p className="mt-1 text-sm text-zinc-300">Global Companies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Alumni Cards */}
          <div className="flex items-start justify-center p-4 sm:p-6 md:p-8">
            {loading ? (
              <div className="w-full">
                <TeamPageSkeleton count={8} />
              </div>
            ) : alumni.length === 0 ? (
              <div className="flex w-full items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/30 p-20 text-zinc-500 font-medium">
                No alumni records found yet. Check back later!
              </div>
            ) : (
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                {alumni.map((member, i) => (
                  <AlumniMemberCard
                    key={member.id || i}
                    id={`team-member-${member.id}`}
                    member={member}
                    priority={i < 3}
                    className="flex"
                    {...buildCardData(member)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RosterPageLayout>
  );
}
