'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface AdminTableSkeletonProps {
    rows?: number;
    columns: string[];
}

export default function AdminTableSkeleton({
    rows = 5,
    columns,
}: AdminTableSkeletonProps) {
    return (
        <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 text-sm">
                <tr>
                    {columns.map((col, i) => (
                        <th
                            key={col}
                            className={`px-6 py-4 font-medium ${i === columns.length - 1 ? 'text-right' : ''} ${i > 0 && i < columns.length - 1 ? 'hidden md:table-cell' : ''}`}
                        >
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
                {Array.from({ length: rows }).map((_, i) => (
                    <tr key={i} className="hover:bg-zinc-800/10 transition-colors">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded bg-zinc-800 hidden sm:block" />
                                <div className="space-y-2 w-full max-w-[150px] md:max-w-xs">
                                    <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                                    <Skeleton className="h-3 w-1/2 bg-zinc-800 md:hidden" />
                                </div>
                            </div>
                        </td>
                        {columns.slice(1, -1).map((col) => (
                            <td key={col} className="px-6 py-4 hidden md:table-cell">
                                <Skeleton className="h-4 w-24 bg-zinc-800" />
                            </td>
                        ))}
                        <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                                <Skeleton className="w-8 h-8 rounded-lg bg-zinc-800" />
                                <Skeleton className="w-8 h-8 rounded-lg bg-zinc-800" />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
