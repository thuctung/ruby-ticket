"use client";

import React, { useState } from "react";
import { Phone,  Facebook, Headset } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingContact = () => {
  const [isHovered, setIsHovered] = useState(false);

  const updatedContacts = [
    {
      name: "Zalo",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.15.195 2.253.553 3.282l-1.51 5.51a.75.75 0 0 0 .925.925l5.51-1.51A9.954 9.954 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5zM16.5 12h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5zM16.5 8.5h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5z"/>
        </svg>
      ),
      label: "Zalo",
      href: "https://zalo.me/0705551668",
      color: "bg-[#0068FF]",
      hoverColor: "hover:bg-[#0056d6]",
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-6 w-6 fill-white text-white" />,
      label: "Facebook",
      href: "https://facebook.com/rubytravel",
      color: "bg-[#1877F2]",
      hoverColor: "hover:bg-[#166fe5]",
    },
    {
      name: "Phone",
      icon: <Phone className="h-6 w-6 fill-white text-white" />,
      label: "Hotline",
      href: "tel:0705551668",
      color: "bg-[#E11D48]", // Ruby Red
      hoverColor: "hover:bg-[#be123c]",
    },
  ];

  return (
    <div 
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sub Buttons */}
      <div className={cn(
        "flex flex-col gap-3 transition-all duration-500 ease-in-out transform",
        isHovered ? "opacity-100 translate-y-0 scale-100 visible" : "opacity-0 translate-y-10 scale-50 invisible pointer-events-none"
      )}>
        {updatedContacts.map((contact, idx) => (
          <a
            key={contact.name}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group relative flex items-center justify-center w-12 h-12 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-110",
              contact.color,
              contact.hoverColor
            )}
            title={contact.label}
          >
            <div className="flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              {contact.icon}
            </div>
            {/* Label on Hover */}
            <div className="absolute right-14 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl pointer-events-none">
              {contact.label}
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45" />
            </div>
          </a>
        ))}
      </div>

      {/* Main Toggle Button */}
      <button
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl transition-all duration-500 transform",
          isHovered ? "bg-slate-900 rotate-180 scale-110" : "bg-blue-600 hover:scale-105"
        )}
      >
        {isHovered ? (
          <span className="text-xl font-bold">×</span>
        ) : (
          <div className="relative">
            <Headset className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingContact;
