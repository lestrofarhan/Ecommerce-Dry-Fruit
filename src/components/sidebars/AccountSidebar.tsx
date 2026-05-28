// components/account/account-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Truck, ChevronRight } from "lucide-react";

interface AccountSidebarProps {
  userName?: string;
  tier?: string;
  points?: string;
}

export function AccountSidebar({
  userName = "Julian",
  tier = "Gold Tier Member",
  points = "2,450",
}: AccountSidebarProps) {
  const pathname = usePathname();

  // Define navigational mapping endpoints
  const navItems = [
    {
      label: "Order History",
      href: "/account/orders",
      icon: History,
    },
    {
      label: "Tracking",
      href: "/account/tracking",
      icon: Truck,
    },
  ];

  return (
    <aside className="w-full space-y-8 text-left">
      {/* User Profile Badge */}
      <div className="space-y-1">
        <h1 className="text-xl font-serif text-zinc-900 tracking-wide font-normal">
          Welcome, {userName}
        </h1>
        <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
          {tier}
        </p>
      </div>

      {/* Control Actions Panel - Now with Actual Next.js Routing Links */}
      <nav className="space-y-1" aria-label="Account Sub Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-medium tracking-wide transition-all duration-150 ${
                isActive
                  ? "bg-[#3c3026] text-white shadow-xs"
                  : "bg-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <Icon className="w-4 h-4 stroke-[1.5]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Reusable Loyalty Wallet Card */}
      <div className="bg-[#f5f1ec] rounded-lg p-5 space-y-4 border border-stone-200/20">
        <div className="space-y-0.5">
          <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-stone-400 block">
            Loyalty Points
          </span>
          <span className="text-xl font-serif text-zinc-900 block font-semibold">
            {points}
          </span>
        </div>
        <button className="text-[10px] font-bold tracking-wider text-zinc-800 hover:text-stone-600 flex items-center gap-1 group transition-colors uppercase">
          <span>Redeem Rewards</span>
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </aside>
  );
}
