'use client';

import { type LucideIcon } from 'lucide-react';

interface AdminPageHeaderProps {
    icon: LucideIcon;
    iconClassName: string;
    title: string;
    subtitle: string;
}

export default function AdminPageHeader({
    icon: Icon,
    iconClassName,
    title,
    subtitle,
}: AdminPageHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${iconClassName}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-zinc-400">{subtitle}</p>
            </div>
        </div>
    );
}
