"use client";

import type { ChangeEvent } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
  className = "",
}: SearchInputProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="w-full bg-zinc-900/50 border border-zinc-700 text-white rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-[#08B74F] focus:ring-1 focus:ring-[#08B74F] transition-all placeholder:text-zinc-500"
      />
    </div>
  );
}
