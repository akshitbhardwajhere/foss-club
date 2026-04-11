"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import api from "@/lib/axios";
import { getStaggeredMotionPresets } from "@/lib/motion";
import RosterPageLayout from "@/components/shared/RosterPageLayout";
import TeamMemberCard from "@/components/cards/TeamMemberCard";
import TeamPageSkeleton from "@/components/skeletons/TeamPageSkeleton";
import type { TeamMember } from "@/components/cards/team-member-card/types";

/**
 * TeamPage Component
 *
 * The public roster displaying all FOSS club core team members.
 * Fetches data asynchronously from the `/api/team` endpoint and renders them using the `TeamMemberCard` component.
 * Layout is staggered gracefully using Framer Motion.
 */
export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { containerVariants, itemVariants } = getStaggeredMotionPresets();

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
      {loading ? (
        <TeamPageSkeleton />
      ) : teamMembers.length === 0 ? (
        <div className="flex items-center justify-center p-20 text-zinc-500 font-medium border border-zinc-800/50 rounded-2xl w-full bg-zinc-900/20">
          No team members found. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-4 min-[420px]:grid-cols-5 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 w-full px-1 sm:px-0">
          {teamMembers.map((member, i) => (
            <TeamMemberCard
              key={member.id || i}
              member={member}
              itemVariants={itemVariants}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </RosterPageLayout>
  );
}
