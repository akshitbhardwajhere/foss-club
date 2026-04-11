"use client";

import { ArrowRight } from "lucide-react";

interface RegistrationCallToActionProps {
  isRegistrationOpen: boolean;
  isRegistrationClosed: boolean;
  registrationLink: string;
  onRegister: (link: string) => void;
}

export default function RegistrationCallToAction({
  isRegistrationOpen,
  isRegistrationClosed,
  registrationLink,
  onRegister,
}: RegistrationCallToActionProps) {
  if (isRegistrationOpen) {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          onRegister(registrationLink);
        }}
        className="mt-5 w-full bg-[#08B74F] hover:bg-[#08B74F]/90 text-black py-2.5 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(8,183,79,0.3)] transition-all flex items-center justify-center gap-2 z-50 pointer-events-auto cursor-pointer"
      >
        Register Now
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  }

  if (isRegistrationClosed) {
    return (
      <div className="mt-5 w-full bg-zinc-800 text-zinc-400 py-2.5 rounded-xl font-bold text-sm border border-zinc-700 flex items-center justify-center cursor-not-allowed">
        Registrations are closed
      </div>
    );
  }

  return null;
}
