import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VerifyIdPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  redirect(`/verify?id=${encodeURIComponent(id)}`);
}
