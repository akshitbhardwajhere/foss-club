"use client";

import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import api from "@/lib/axios";
import { getStaggeredMotionPresets } from "@/lib/motion";
import RosterPageLayout from "@/components/shared/RosterPageLayout";
import TeamMemberCard from "@/components/cards/TeamMemberCard";
import AlumniPageSkeleton from "@/components/skeletons/AlumniPageSkeleton";
import type { TeamMember } from "@/components/cards/team-member-card/types";

/**
 * AlumniPage Component
 *
 * The public roster displaying all FOSS club alumni.
 * Fetches data asynchronously from the `/api/alumni` endpoint.
 */
export default function AlumniPage() {
  const [alumni, setAlumni] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { containerVariants, itemVariants } = getStaggeredMotionPresets();

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
      description="The trailblazers who built the foundation of FOSS Club NIT Srinagar. See where our past members are making an impact today."
      containerVariants={containerVariants}
      itemVariants={itemVariants}
    >
      {loading ? (
        <AlumniPageSkeleton />
      ) : alumni.length === 0 ? (
        <div className="flex items-center justify-center p-20 text-zinc-500 font-medium border border-zinc-800/50 rounded-2xl w-full bg-zinc-900/20">
          No alumni records found yet.
        </div>
      ) : (
        <div className="grid grid-cols-4 min-[420px]:grid-cols-5 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 w-full px-1 sm:px-0">
          {alumni.map((member, i) => (
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
