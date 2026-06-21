"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I need prior experience to join?",
    a: "Absolutely not. We welcome complete beginners. Many of our most active contributors started with zero coding experience. We have dedicated onboarding sessions and a beginner-friendly community.",
  },
  {
    q: "Is the club free to join?",
    a: "Yes, 100% free. FOSS Club is a student-run community at NIT Srinagar. There are no membership fees. All workshops, events, and resources are free for all students.",
  },
  {
    q: "Is it open to all branches, not just CSE?",
    a: "Yes! We actively encourage students from all engineering branches — ECE, ME, Civil, EE, IT — to join. Technology skills are valuable regardless of your stream.",
  },
  {
    q: "How do I make my first open source contribution?",
    a: "Start with our Open Source Roadmap blog series. We also run regular 'First Contribution' workshops where our core team walks you through forking, branching, and submitting your first PR.",
  },
  {
    q: "What kind of events do you organize?",
    a: "We organize technical workshops (Git, Linux, Web Dev, AI/ML), hackathons, CTF competitions, guest talks from industry engineers, and open-source contribution sprints.",
  },
  {
    q: "Can I get mentorship from seniors?",
    a: "Yes. Our core team and alumni network actively mentor juniors. We also connect members with industry professionals through our LinkedIn and Discord communities.",
  },
  {
    q: "Does FOSS Club help with internship and placement prep?",
    a: "Indirectly, yes — and very effectively. A strong GitHub profile, open-source contributions, and real project experience built through the club significantly boost your chances with top companies.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-24 z-10">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#08B74F] mb-4">FAQ</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          Questions? We&apos;ve got answers.
        </h2>
      </motion.div>

      <div className="flex flex-col divide-y divide-zinc-800/60">
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left text-white group"
              aria-expanded={openIndex === i}
            >
              <span className="font-semibold text-sm sm:text-base group-hover:text-[#08B74F] transition-colors">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
                  openIndex === i ? "rotate-180 text-[#08B74F]" : ""
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-sm sm:text-base text-zinc-400 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
