"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Button {
  text: string;
  href: string;
}

interface SideItemProps {
  buttons: Button[];
}

export default function SideItem({ buttons }: SideItemProps) {
  const pathname = usePathname();

  return (
    <aside className="bg-white w-72 h-screen flex flex-col shadow-md border-r border-gray-200">
      <nav className="flex flex-col flex-grow overflow-y-auto">
        {buttons.map((button, index) => {
          const isActive = pathname === button.href;

          return (
            <Link
              key={index}
              href={button.href}
              className={`block mt-20 py-5 px-8 transition-colors duration-200 border-gray-200 border-2 ${
                isActive ? "bg-green-500 text-white" : "hover:bg-gray-100"
              }`}
            >
              <span className="text-lg font-semibold">
                {button.text}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
