"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import api from "@/lib/axios";
import BackgroundBlur from "@/components/shared/BackgroundBlur";
import PageHeader from "@/components/shared/PageHeader";
import TeamMemberCard from "@/components/cards/TeamMemberCard";
import AlumniPageSkeleton from "@/components/skeletons/AlumniPageSkeleton";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company?: string;
  imageUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

/**
 * AlumniPage Component
 *
 * The public roster displaying all FOSS club alumni.
 * Fetches data asynchronously from the `/api/alumni` endpoint.
 */
export default function AlumniPage() {
  const [alumni, setAlumni] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

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
          className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-500 text-sm font-medium"
        >
          <GraduationCap className="w-4 h-4" /> Hall of Fame
        </motion.div>

        <PageHeader
          title={
            <>
              Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-amber-600">
                Alumni
              </span>
            </>
          }
        />

        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-lg max-w-2xl mb-16"
        >
          The trailblazers who built the foundation of FOSS Club NIT Srinagar.
          See where our past members are making an impact today.
        </motion.p>

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
      </motion.div>
    </div>
  );
}
