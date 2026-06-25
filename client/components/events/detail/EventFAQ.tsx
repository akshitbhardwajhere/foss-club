"use client";

import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function EventFAQ() {
  const faqs = [
    {
      question: "Who can attend this event?",
      answer: "The event is open to all students of NIT Srinagar across all branches and semesters who are interested in programming, open-source development, and technology. No prior advanced knowledge is required.",
    },
    {
      question: "Do I need to bring my laptop?",
      answer: "Yes, we highly recommend bringing a fully-charged laptop for the hands-on lab sessions. Don't forget to pack your charger and extensions if needed.",
    },
    {
      question: "Is there any registration fee?",
      answer: "No, all events hosted by FOSS Club NIT Srinagar are completely free of charge. Open-source belongs to everyone!",
    },
    {
      question: "Will certificates be provided?",
      answer: "Yes, verified certificates of participation will be issued by the FOSS Club to all attendees who actively participate in the hands-on sessions and submit the post-event feedback form.",
    },
    {
      question: "Where is the venue located?",
      answer: "The venue is mentioned in the event information card (usually the main seminar hall, computer center labs, or L-series lecture halls). Any changes will be notified via email or official social channels.",
    },
  ];

  return (
    <div className="w-full bg-zinc-900/20 border border-zinc-800/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 mt-10">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <HelpCircle className="w-5 h-5 text-[#08B74F]" /> Frequently Asked Questions
      </h3>

      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-zinc-900 bg-zinc-950/40 rounded-xl px-4 transition-colors hover:border-zinc-850"
          >
            <AccordionTrigger className="text-zinc-200 hover:text-white hover:no-underline font-semibold py-4 text-sm md:text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 leading-relaxed text-xs md:text-sm">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
