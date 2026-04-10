"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import TeamMemberCard from "@/components/cards/TeamMemberCard";
import TeamPageSkeleton from "@/components/skeletons/TeamPageSkeleton";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="bg-[#050B08] text-white min-h-screen flex flex-col items-center overflow-x-hidden relative w-full pt-32 pb-20 px-4 font-sans selection:bg-[#08B74F]/30 selection:text-white">
      {/* Dynamic Background Blurs */}
      <BackgroundBlur />

      <motion.div
        className="w-full max-w-6xl z-10 flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#08B74F]/30 bg-[#08B74F]/5 text-[#08B74F] text-sm font-medium"
        >
          <Users className="w-4 h-4" /> Core Team
        </motion.div>

        <PageHeader
          title={
            <>
              Meet the{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#08B74F] to-emerald-400">
                Innovators
              </span>
            </>
          }
        />

        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-lg max-w-2xl mb-16"
        >
          The passionate individuals driving the open-source culture at NIT
          Srinagar. We are developers, designers, and creators building the
          future together.
        </motion.p>

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
      </motion.div>
    </div>
  );
}
