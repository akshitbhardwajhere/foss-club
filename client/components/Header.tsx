"use client";
import { Calendar, Headset, Info, Menu, Terminal, Users } from "lucide-react";
import { Button } from "./ui/button";
import { navlinks } from "@/data/navlinks";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Header() {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 w-full h-14 border-b border-gray-700">
      {/* Div 1 -> Logo */}
      <div className="flex justify-center items-center gap-2">
        <div className="text-center bg-(--foss-main)/50 rounded p-1">
          <Link href="/">
            <Terminal className="text-(--foss-main)" />
          </Link>
        </div>
        <div className="text-center">
          <Link href="/">
            <h1 className="text-(--foss-text) font-bold">FOSS NIT Srinagar</h1>
          </Link>
        </div>
      </div>
      {/* Div 2 -> Links */}
      <div>
        <ul className="gap-4 sm:flex hidden">
          {navlinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="text-(--foss-text) hover:text-(--foss-main) transition-colors duration-300"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-center gap-1">
        {/* Div-3 -> Button */}
        <div className="p-2">
          <div>
            <Button className="bg-(--foss-main) hover:bg-(--foss-main) text-(--foss-background)">
              Join Us
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                className="bg-(--foss-background) border border-gray-700"
              >
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-(--foss-background) text-(--foss-text) border border-gray-700">
              <DropdownMenuGroup>
                <Link href="/about">
                  <DropdownMenuItem>
                    <span>
                      <Info size={20} />
                    </span>
                    About
                  </DropdownMenuItem>
                </Link>
                <Link href="/events">
                  <DropdownMenuItem>
                    <span>
                      <Calendar size={20} />
                    </span>
                    Events
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-700" />
                <Link href="/team">
                  <DropdownMenuItem>
                    <span>
                      <Users size={20} />
                    </span>
                    Team
                  </DropdownMenuItem>
                </Link>
                <Link href="/contact">
                  <DropdownMenuItem>
                    <span>
                      <Headset size={20} />
                    </span>
                    Contact
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Header;
