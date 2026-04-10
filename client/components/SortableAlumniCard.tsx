import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GraduationCap, Edit3, GripVertical, Trash2 } from 'lucide-react';
import ConfirmDeleteDialog from '@/components/admin/ConfirmDeleteDialog';
import Image from 'next/image';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    company?: string;
    imageUrl?: string;
}

interface SortableAlumniCardProps {
    member: TeamMember;
    onEdit: (member: TeamMember) => void;
    onRemove: (id: string, name?: string) => void;
}

export function SortableAlumniCard({ member, onEdit, onRemove }: SortableAlumniCardProps) {
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
            className={`bg-zinc-900/50 border ${isDragging ? 'border-yellow-500' : 'border-zinc-800'} rounded-3xl p-5 pt-12 pb-5 flex flex-col items-center text-center relative group transition-colors`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 left-4 w-8 h-8 rounded-full text-zinc-500 cursor-grab active:cursor-grabbing flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-colors touch-none"
                title="Drag to reorder"
            >
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Edit Button */}
            <button
                onClick={() => onEdit(member)}
                className="absolute top-4 right-14 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                title="Edit member"
            >
                <Edit3 className="w-4 h-4" />
            </button>

            {/* Remove from Alumni Button */}
            <ConfirmDeleteDialog
                trigger={
                    <button
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove from Alumni"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                }
                itemName={member.name}
                onConfirm={() => onRemove(member.id, member.name)}
                // override titles for clarify
                title="Remove from Alumni?"
                description={`Are you sure you want to remove ${member.name} from the Alumni list? They will be reverted back to a normal team member.`}
            />

            <div className={`w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-900 mb-4 overflow-hidden relative shadow-xl ring-1 ring-zinc-700/50 ${isDragging ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-zinc-900' : ''}`}>
                <Image
                    src={member.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
                    alt={member.name}
                    fill
                    sizes="250px"
                    className="object-cover pointer-events-none group-hover:scale-110 transition-transform duration-500"
                />
            </div>

            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{member.name}</h3>
            <p className="text-xs text-yellow-500 font-medium mb-3 bg-yellow-500/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
                <GraduationCap className="w-3 h-3" />
                {member.role}
            </p>
            {member.company && (
                <p className="text-zinc-400 text-xs mt-1 bg-zinc-800/50 inline-block px-2 py-0.5 rounded-full">
                    @ {member.company}
                </p>
            )}
        </div>
    );
}
