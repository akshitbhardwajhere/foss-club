import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GraduationCap, Edit3, Trash2 } from "lucide-react";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import SortableCardFrame from "@/components/sortable-member-card/SortableCardFrame";
import SortableDragHandle from "@/components/sortable-member-card/SortableDragHandle";
import SortableActionButton from "@/components/sortable-member-card/SortableActionButton";
import SortableMemberAvatar from "@/components/sortable-member-card/SortableMemberAvatar";

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

export function SortableAlumniCard({
  member,
  onEdit,
  onRemove,
}: SortableAlumniCardProps) {
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
    <SortableCardFrame
      setNodeRef={setNodeRef}
      style={style}
      isDragging={isDragging}
      accentClassName="border-yellow-500"
    >
      <SortableDragHandle
        attributes={attributes}
        listeners={listeners}
        title="Drag to reorder"
      />

      {/* Edit Button */}
      <SortableActionButton
        onClick={() => onEdit(member)}
        className="absolute top-4 right-14 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        title="Edit member"
      >
        <Edit3 className="w-4 h-4" />
      </SortableActionButton>

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

      <SortableMemberAvatar
        src={
          member.imageUrl ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`
        }
        alt={member.name}
        isDragging={isDragging}
        accentRingClassName="ring-2 ring-yellow-500 ring-offset-2 ring-offset-zinc-900"
        fallback="alumni"
      />

      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
        {member.name}
      </h3>
      <p className="text-xs text-yellow-500 font-medium mb-3 bg-yellow-500/10 px-3 py-1 rounded-full inline-flex items-center gap-1">
        <GraduationCap className="w-3 h-3" />
        {member.role}
      </p>
      {member.company && (
        <p className="text-zinc-400 text-xs mt-1 bg-zinc-800/50 inline-block px-2 py-0.5 rounded-full">
          @ {member.company}
        </p>
      )}
    </SortableCardFrame>
  );
}
