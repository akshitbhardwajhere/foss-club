"use client";

import { motion } from "framer-motion";
import { Clock, Users, Play, Award, Coffee, Code2 } from "lucide-react";

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function EventAgenda() {
  const agenda: AgendaItem[] = [
    {
      time: "10:00 AM",
      title: "Registrations & Welcome Keynote",
      description: "Get checked-in, collect custom FOSS merchandise, and find your seats. Introduction by the FOSS Club President.",
      icon: <Users className="w-4 h-4 text-emerald-400" />,
    },
    {
      time: "10:45 AM",
      title: "Core Session & Tech Deep-dive",
      description: "A comprehensive exploration of the technologies, tools, and paradigms featured in this event. led by senior developers.",
      icon: <Play className="w-4 h-4 text-blue-400" />,
    },
    {
      time: "12:15 PM",
      title: "Interactive Hands-on Lab",
      description: "Bring your laptops! Participate in guided coding sprints, setting up local developer environments, and building mini-projects.",
      icon: <Code2 className="w-4 h-4 text-[#08B74F]" />,
    },
    {
      time: "01:45 PM",
      title: "Lunch & Peer Networking",
      description: "Refuel and engage with fellow attendees, senior club executives, and industry mentors. Great time to discuss project ideas.",
      icon: <Coffee className="w-4 h-4 text-amber-400" />,
    },
    {
      time: "02:45 PM",
      title: "Project Showcases & Reviews",
      description: "Present what you built in the hands-on lab or pitch your own open-source projects to get structured feedback from mentors.",
      icon: <Code2 className="w-4 h-4 text-purple-400" />,
    },
    {
      time: "04:15 PM",
      title: "Q&A, Certificates & Closing",
      description: "Closing notes, certificate distributions for active participants, feedback collection, and the classic group photograph.",
      icon: <Award className="w-4 h-4 text-red-400" />,
    },
  ];

  return (
    <div className="w-full bg-zinc-900/20 border border-zinc-800/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 mt-10">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center gap-3">
        <Clock className="w-5 h-5 text-[#08B74F]" /> Event Timeline
      </h3>

      <div className="relative border-l border-zinc-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8">
        {agenda.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Timeline node */}
            <div className="absolute -left-[43px] md:-left-[51px] top-1 w-8 h-8 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center group-hover:border-[#08B74F]/50 group-hover:bg-zinc-900 transition-all duration-300 shadow-lg">
              {item.icon}
            </div>

            <div className="bg-zinc-900/30 border border-zinc-850 hover:border-zinc-800 rounded-xl p-4 transition-all duration-300 hover:bg-zinc-900/50 hover:shadow-lg">
              <span className="inline-block text-xs font-bold text-[#08B74F] bg-[#08B74F]/10 border border-[#08B74F]/20 px-2 py-0.5 rounded-full mb-2">
                {item.time}
              </span>
              <h4 className="text-base md:text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed mt-1 group-hover:text-zinc-350 transition-colors">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
