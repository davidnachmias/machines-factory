import React from "react";
import Hamburger from "./Hamburger";
import SideItem from "./SideItem";

interface Button {
  text: string;
  href: string;
}

interface SidebarProps {
  buttons: Button[];
}

export default function Sidebar({ buttons }: SidebarProps) {
  return (
    <div>
      {/* Mobile View */}
      <div className="block md:hidden">
        <Hamburger buttons={buttons} />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <SideItem buttons={buttons} />
      </div>
    </div>
  );
}
