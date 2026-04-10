'use client';

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
import { type ReactNode } from 'react';

interface ConfirmDeleteDialogProps {
    /** The trigger button element */
    trigger: ReactNode;
    /** Display name of the item being deleted, shown in the confirmation message */
    itemName: string;
    /** Called when the user confirms deletion */
    onConfirm: () => void;
    /** Optional custom title text */
    title?: string;
    /** Optional custom description text */
    description?: string;
}

export default function ConfirmDeleteDialog({
    trigger,
    itemName,
    onConfirm,
    title,
    description,
}: ConfirmDeleteDialogProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title || "Are you absolutely sure?"}</AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                        {description || `This action cannot be undone. This will permanently delete "${itemName}".`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
