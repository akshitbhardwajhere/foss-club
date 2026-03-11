"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type ReactNode } from "react";

interface ConfirmActionDialogProps {
  /** The trigger button element */
  trigger: ReactNode;
  /** Dialog title */
  title: string;
  /** Dialog description */
  description: string;
  /** Label for the confirm action button */
  actionLabel: string;
  /** Optional className for the action button */
  actionClassName?: string;
  /** Called when the user confirms the action */
  onConfirm: () => void;
}

export default function ConfirmActionDialog({
  trigger,
  title,
  description,
  actionLabel,
  actionClassName,
  onConfirm,
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              actionClassName ??
              "!bg-orange-600 hover:!bg-orange-700 !text-white"
            }
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
