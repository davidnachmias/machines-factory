"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Button {
  text: string;
  href: string;
}

interface HamburgerProps {
  buttons: Button[];
}

export default function Hamburger({ buttons }: HamburgerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-white shadow-md border rounded-md focus:outline-none"
      >
        ☰
      </button>
      {isOpen && (
        <nav className="absolute top-full right-0 bg-white shadow-md w-48">
          {buttons.map((button, index) => {
            const isActive = pathname === button.href;

            return (
              <Link
                key={index}
                href={button.href}
                className={`block px-4 py-2 transition ${
                  isActive ? "bg-green-500 text-white" : "hover:bg-gray-100"
                }`}
              >
                {button.text}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
