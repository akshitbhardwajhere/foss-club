import type { Variants } from "framer-motion";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  company?: string;
  imageUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
}

export interface TeamMemberCardProps {
  member: TeamMember;
  itemVariants: Variants;
  priority?: boolean;
}

export type SocialPlatform = "github" | "linkedin" | "twitter";

export interface SocialLink {
  href: string;
  platform: SocialPlatform;
  title: string;
  hoverClassName: string;
}
