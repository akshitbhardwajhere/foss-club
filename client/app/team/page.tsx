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
      label: "Core Members",
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
          <Users className="w-4 h-4" /> Core Team
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
      description="The passionate individuals driving the open-source culture at NIT Srinagar. We are developers, designers, and creators building the future together."
      containerVariants={containerVariants}
      itemVariants={itemVariants}
    >
      <div className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/30 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-55 overflow-hidden border-b border-zinc-800 lg:min-h-70 lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(8,183,79,0.18),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_24%,rgba(0,0,0,0.32)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-20 bg-black/20 blur-3xl" />
            <div className="relative z-10 flex h-full items-center justify-center p-6 md:p-10">
              <div className="grid w-full max-w-xl place-items-center rounded-[1.75rem] border border-white/5 bg-white/3 p-5 shadow-inner backdrop-blur-sm">
                <div className="relative flex h-20 w-full items-end justify-center overflow-hidden rounded-[1.5rem] bg-black/20 sm:h-24 md:h-28">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
                  <div className="absolute inset-x-[22%] top-[34%] h-20 rounded-full bg-[#08B74F]/20 blur-3xl" />
                  <div className="flex items-end gap-1 sm:gap-1.5">
                    <div className="h-10 w-5 rounded-t-full bg-zinc-200/90 sm:h-12 sm:w-6" />
                    <div className="h-12 w-5 rounded-t-full bg-zinc-300/95 sm:h-14 sm:w-6" />
                    <div className="h-16 w-7 rounded-t-full bg-white sm:h-20 sm:w-8" />
                    <div className="h-12 w-5 rounded-t-full bg-zinc-300/95 sm:h-14 sm:w-6" />
                    <div className="h-10 w-5 rounded-t-full bg-zinc-200/90 sm:h-12 sm:w-6" />
                  </div>
                  <div className="absolute top-5 h-2 w-14 rounded-full bg-white/90 blur-[1px] sm:top-6 sm:w-16" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 p-6 md:p-10">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-zinc-500">
                Team
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Over {teamMembers.length} people,
                <br />
                United by FOSS
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                The people building, managing, and supporting the FOSS Club at NIT Srinagar.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/60 p-5 shadow-inner">
              <p className="text-sm leading-7 text-zinc-300 sm:text-base">
                Meet the core team and volunteers driving the club forward.
                Explore members, search by name, and jump directly to a profile.
              </p>

              <button
                type="button"
                onClick={randomMember}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#08B74F] px-5 py-3 font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#08B74F]/90"
              >
                Start Exploring
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-5 grid grid-cols-2 divide-x divide-zinc-800 text-center">
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
        </div>

        <div className="flex flex-col gap-4 border-t border-zinc-800 p-4 md:flex-row md:items-center md:justify-between md:p-5">
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
            <label className="relative flex w-full max-w-md items-center">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-zinc-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-zinc-800 bg-zinc-950/70 py-3 pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-[#08B74F]/50"
              />
            </label>

            <button
              type="button"
              onClick={() => randomMember()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-100 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-950 transition-colors hover:bg-white md:w-auto"
            >
              <Shuffle className="h-4 w-4" />
              Surprise Me
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <span>Sort by:</span>
            <div className="rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2">
              <select
                value={activeTab}
                onChange={(event) => setActiveTab(event.target.value as "core" | "volunteers")}
                className="bg-transparent text-sm text-white outline-none"
              >
                <option value="core">Core Members</option>
                <option value="volunteers">Volunteers</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-6xl rounded-full border border-zinc-800 bg-zinc-900/40 p-1 backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                isActive
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

      {loading ? (
        <div className="mt-6 w-full max-w-6xl">
          <TeamPageSkeleton />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="mt-6 flex w-full max-w-6xl items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/30 p-20 text-zinc-500 font-medium">
          No {activeTab === "core" ? "core members" : "volunteers"} found. Check back later!
        </div>
      ) : (
        <div className="mt-6 grid w-full max-w-6xl grid-cols-3 gap-2.5 px-1 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-6 sm:px-0">
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
    </RosterPageLayout>
  );
}
