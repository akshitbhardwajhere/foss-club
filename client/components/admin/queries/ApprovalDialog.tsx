"use client";

import { CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ApprovalTarget {
  name: string;
  email: string;
}

interface ApprovalDialogProps {
  open: boolean;
  target: ApprovalTarget | null;
  basis: string;
  basisOptions: string[];
  isSubmitting: boolean;
  onBasisChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ApprovalDialog({
  open,
  target,
  basis,
  basisOptions,
  isSubmitting,
  onBasisChange,
  onClose,
  onSubmit,
}: ApprovalDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="bg-[#050B08] border border-zinc-800 text-white rounded-2xl max-w-md shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#08B74F]" /> Dispatch Approval
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 mt-2">
            You are highly recommending <strong>{target?.name}</strong> to join
            the FOSS Community. This will dispatch a styled automated email to{" "}
            <span className="text-zinc-300 font-medium">{target?.email}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <label className="block text-sm font-semibold text-zinc-300 mb-2">
            On which basis are you approving this request?
          </label>
          <select
            value={basis}
            onChange={(e) => onBasisChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#08B74F]/50 transition-colors appearance-none cursor-pointer"
          >
            {basisOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500 mt-2 italic">
            This criteria constraint will be explicitly listed in the approval
            email.
          </p>
        </div>

        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel
            disabled={isSubmitting}
            className="bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800 hover:text-white rounded-xl"
          >
            Cancel
          </AlertDialogCancel>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`inline-flex h-10 items-center justify-center rounded-xl font-bold px-4 py-2 transition-colors ${
              isSubmitting
                ? "bg-[#08B74F]/50 text-zinc-300 cursor-not-allowed"
                : "bg-[#08B74F] text-black hover:bg-[#08B74F]/90"
            }`}
          >
            {isSubmitting ? "Dispatching..." : "Send Approval ->"}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
