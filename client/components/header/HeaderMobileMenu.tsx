"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Headset,
  Info,
  Menu,
  Users,
  BookOpen,
  House,
  Image as ImageIcon,
  GraduationCap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderMobileMenu() {
  return (
    <div className="lg:hidden flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 mt-2 bg-[#050B08]/90 backdrop-blur-lg border border-zinc-800/50 text-white rounded-2xl overflow-hidden shadow-2xl p-2"
        >
          <Link href="/">
            <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
              <House className="w-5 h-5 text-zinc-400" />
              <span className="font-medium">Home</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuGroup>
            <Link href="/events">
              <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                <Calendar className="w-5 h-5 text-zinc-400" />
                <span className="font-medium">Events</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/gallery">
              <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                <ImageIcon className="w-5 h-5 text-zinc-400" />
                <span className="font-medium">Gallery</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/blogs">
              <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                <BookOpen className="w-5 h-5 text-zinc-400" />
                <span className="font-medium">Blogs</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/team">
              <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                <Users className="w-5 h-5 text-zinc-400" />
                <span className="font-medium">Team</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/alumni">
              <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-yellow-500 cursor-pointer rounded-xl p-3 gap-3">
                <GraduationCap className="w-5 h-5 text-zinc-400" />
                <span className="font-medium">Alumni</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-zinc-800 my-1" />
          <DropdownMenuGroup>
            <Link href="/about">
              <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                <Info className="w-5 h-5 text-zinc-400" />
                <span className="font-medium">About Us</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/contact">
              <DropdownMenuItem className="text-white focus:bg-zinc-800/60 focus:text-[#08B74F] cursor-pointer rounded-xl p-3 gap-3">
                <Headset className="w-5 h-5 text-zinc-400" />
                <span className="font-medium">Contact</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
