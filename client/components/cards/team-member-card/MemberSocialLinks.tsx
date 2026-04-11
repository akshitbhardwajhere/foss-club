"use client";

import { Github, Linkedin } from "lucide-react";
import type { SocialLink } from "./types";

interface MemberSocialLinksProps {
  links: SocialLink[];
  buttonClassName: string;
  iconSize: 20 | 24;
}

export default function MemberSocialLinks({
  links,
  buttonClassName,
  iconSize,
}: MemberSocialLinksProps) {
  const iconClassName = iconSize === 24 ? "w-6 h-6" : "w-5 h-5";

  return links.map((social) => (
    <a
      key={social.title}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.title}
      title={social.title}
      className={`${buttonClassName} ${social.hoverClassName}`}
    >
      {social.platform === "github" && <Github className={iconClassName} />}
      {social.platform === "linkedin" && <Linkedin className={iconClassName} />}
      {social.platform === "twitter" && (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.774H18.916L7.084 4.126H5.117L17.083 19.774Z"
            fill="currentColor"
          />
        </svg>
      )}
    </a>
  ));
}
