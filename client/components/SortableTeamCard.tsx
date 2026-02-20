import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Users, Edit3, GripVertical, Github, Linkedin, Twitter } from 'lucide-react';
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

interface TeamMember {
    id: string;
    name: string;
    role: string;
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    twitterUrl?: string;
    imageUrl?: string;
}

interface SortableTeamCardProps {
    member: TeamMember;
    onEdit: (member: TeamMember) => void;
    onDelete: (id: string) => void;
}

export function SortableTeamCard({ member, onEdit, onDelete }: SortableTeamCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: member.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-zinc-900/50 border ${isDragging ? 'border-[#08B74F]' : 'border-zinc-800'} rounded-3xl p-6 flex flex-col items-center text-center relative group transition-colors`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 left-4 w-8 h-8 rounded-full text-zinc-500 cursor-grab active:cursor-grabbing flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-colors"
                title="Drag to reorder"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Edit Button */}
            <button
                onClick={() => onEdit(member)}
                className="absolute top-4 right-14 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700 hover:text-white"
                title="Edit member"
            >
                <Edit3 className="w-4 h-4" />
            </button>

            {/* Delete Button */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <button
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                        title="Remove member"
                    >
                        <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4H3.5C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            This action cannot be undone. This will permanently remove {member.name} from the team.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-300">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(member.id)} className="bg-red-600 hover:bg-red-700 text-white">Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className={`w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 mb-4 overflow-hidden relative shadow-lg ${isDragging ? 'ring-2 ring-[#08B74F] ring-offset-2 ring-offset-zinc-900' : ''}`}>
                {member.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-800/50">
                        <Users className="w-8 h-8" />
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
            <p className="text-sm text-[#08B74F] font-medium mb-4 bg-[#08B74F]/10 px-3 py-1 rounded-full">{member.role}</p>

            <div className="flex items-center justify-center gap-3 mt-auto pt-4 border-t border-zinc-800/50 w-full opacity-50">
                {member.githubUrl && <div className="rounded-full bg-zinc-700 p-2" title="GitHub linked">
                    <a href={member.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                    </a>
                </div>}
                {member.linkedinUrl && <div className="rounded-full bg-blue-500/50 p-2" title="LinkedIn linked">
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                    </a>
                </div>}
                {member.twitterUrl && <div className="rounded-full bg-sky-500/50 p-2" title="Twitter linked">
                    <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                    </a>
                </div>}
                {!member.githubUrl && !member.linkedinUrl && !member.twitterUrl && <span className="text-xs text-zinc-600">No socials</span>}
            </div>
        </div>
    );
}
