"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Search, Shuffle, Users } from "lucide-react";
import api from "@/lib/axios";
import { getStaggeredMotionPresets } from "@/lib/motion";
import RosterPageLayout from "@/components/shared/RosterPageLayout";
import TeamMemberMobileCard from "@/components/cards/team-member-card/TeamMemberMobileCard";
import TeamPageSkeleton from "@/components/skeletons/TeamPageSkeleton";
import { ensureUrl } from "@/lib/utils";
import type {
  SocialLink,
  TeamMember,
} from "@/components/cards/team-member-card/types";

/**
 * TeamPage Component
 *
 * The public roster displaying all FOSS club core team members.
 * Fetches data asynchronously from the `/api/team` endpoint and renders them using the mobile team card layout.
 * Layout is staggered gracefully using Framer Motion.
 */
export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"core" | "volunteers">("core");
  const [searchQuery, setSearchQuery] = useState("");
  const { containerVariants, itemVariants } = getStaggeredMotionPresets();

  const isVolunteerRole = (role: string) => /\bvolunteer\b/i.test(role);

  const coreMembers = useMemo(
    () => teamMembers.filter((member) => !isVolunteerRole(member.role)),
    [teamMembers],
  );

  const volunteerMembers = useMemo(
    () => teamMembers.filter((member) => isVolunteerRole(member.role)),
    [teamMembers],
  );

  const tabs = [
    {
      id: "core" as const,
      label: "Core Team",
      icon: Users,
      count: coreMembers.length,
    },
    {
      id: "volunteers" as const,
      label: "Volunteers",
      icon: BadgeCheck,
      count: volunteerMembers.length,
    },
  ];

  const activeMembers = activeTab === "core" ? coreMembers : volunteerMembers;

  const filteredMembers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return activeMembers;

    return activeMembers.filter((member) => {
      const haystack = [member.name, member.role, member.company]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeMembers, searchQuery]);

  const randomMember = () => {
    const pool = filteredMembers.length > 0 ? filteredMembers : activeMembers;
    if (pool.length === 0) return;

    const selected = pool[Math.floor(Math.random() * pool.length)];
    const element = document.getElementById(`team-member-${selected.id}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  };

  const isAlumniMember = (member: TeamMember) =>
    !!member.company ||
    member.role.toLowerCase().includes("alumni") ||
    member.role.toLowerCase().includes("former");

  const buildMobileCardData = (member: TeamMember) => {
    const avatarSrc =
      member.imageUrl ||
      `https://api.dicebear.com/9.x/pixel-art/svg?seed=${member.name}`;
    const firstName = member.name.split(" ")[0];
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

    return { avatarSrc, firstName, isAlumni, textTheme, codeLines, socialLinks };
  };

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get("/api/team");
        setTeamMembers(response.data);
      } catch (error) {
        // Error silently logged in production
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <RosterPageLayout
      badge={
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-sm font-medium">
          <Users className="w-4 h-4" /> FOSS Team
        </div>
      }
      title={
        <>
          Meet the{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#08B74F] to-emerald-400">
            Innovators
          </span>
        </>
      }
      // description="The passionate individuals driving the open-source culture at NIT Srinagar. We are developers, designers, and creators building the future together."
      containerVariants={containerVariants}
      itemVariants={itemVariants}
    >

      {/* Tabs */}
      <div className="mb-6 flex w-full sm:w-[80%] lg:w-[40%] max-w-6xl rounded-full border border-zinc-800 bg-zinc-900/40 p-1 backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all ${isActive
                  ? "bg-[#08B74F] text-black shadow-[0_0_30px_rgba(8,183,79,0.2)]"
                  : "text-zinc-400 hover:text-white"
                }`}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-black/10" : "bg-zinc-800 text-zinc-300"}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/30 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <div className="grid gap-0 lg:grid-cols-[1fr_1.2fr]">

          {/* Left: Info / Stats panel */}
          <div className="flex flex-col justify-center gap-6 border-b border-zinc-800 p-6 lg:border-b-0 lg:border-r md:p-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-zinc-500">
                Team
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Over {teamMembers.length} people,
                <br />
                United by FOSS Club
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                The people building, managing, and supporting the FOSS Club at NIT Srinagar.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/60 p-5 shadow-inner">
              <div className="grid grid-cols-2 divide-x divide-zinc-800 text-center">
                <div className="pr-4">
                  <p className="text-3xl font-black text-[#08B74F]">{coreMembers.length}</p>
                  <p className="mt-1 text-sm text-zinc-300">Core Members</p>
                </div>
                <div className="pl-4">
                  <p className="text-3xl font-black text-[#08B74F]">{volunteerMembers.length}</p>
                  <p className="mt-1 text-sm text-zinc-300">Volunteers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Team Cards */}
          <div className="flex items-start justify-center p-4 sm:p-6 md:p-8">
            {loading ? (
              <div className="w-full">
                <TeamPageSkeleton />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="flex w-full items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/30 p-20 text-zinc-500 font-medium">
                No {activeTab === "core" ? "core members" : "volunteers"} found. Check back later!
              </div>
            ) : (
              <div className="grid w-full grid-cols-5 gap-3 sm:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6">
                {filteredMembers.map((member, i) => (
                  <TeamMemberMobileCard
                    key={member.id || i}
                    id={`team-member-${member.id}`}
                    member={member}
                    priority={i < 3}
                    className="flex"
                    {...buildMobileCardData(member)}
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
