"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  History,
  LogOut,
  Plus,
  Search,
  Sparkles,
  User,
  Crown,
} from "lucide-react";

interface Props {
  children: ReactNode;
}

const recentReviews = [
  "Frontend Developer",
  "Data Analyst",
  "Software Engineer",
  "Product Designer",
];

export default function HomeLayout({ children }: Props) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profilePinned, setProfilePinned] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const navItems = [
    {
      label: "Dashboard",
      href: "/home",
      icon: LayoutDashboard,
    },
    {
      label: "History",
      href: "/history",
      icon: History,
    },
  ];

  /*
   * close profile menu when clicking outside
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
        setProfilePinned(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showProfileMenu = profileOpen || profilePinned;

  return (
    <main className="flex min-h-screen bg-[#f8fafc] text-gray-900">
      {/* SIDEBAR */}
      <aside
        className={`
          sticky top-0 flex h-screen shrink-0 flex-col
          border-r border-gray-200 bg-white
          transition-[width] duration-300
          ${collapsed ? "w-19" : "w-65"}
        `}
      >
      {/* HEADER */}
      <div className="flex h-20 shrink-0 items-center justify-between px-4">
        <Link
          href="/home"
          className={`
            flex items-center gap-3
            ${collapsed ? "w-full justify-center" : ""}
          `}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
            <Sparkles size={18} strokeWidth={2.5} />
          </div>

          {!collapsed && (
            <span className="text-xl font-bold tracking-tight">
              Karyo
            </span>
          )}
        </Link>

        {!collapsed && (
          <div className="flex items-center gap-1">
            {/* SEARCH */}
            <button
              type="button"
              title="Search reviews"
              className="
                rounded-lg p-2
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-700
              "
            >
              <Search size={17} />
            </button>

            {/* COLLAPSE */}
            <button
              type="button"
              onClick={() => {
                setCollapsed(true);
                setProfileOpen(false);
                setProfilePinned(false);
              }}
              title="Collapse sidebar"
              className="
                rounded-lg p-2
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-700
              "
            >
              <ChevronLeft size={17} />
            </button>
          </div>
        )}

        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            className="
              absolute right-3
              rounded-lg p-2
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
          >
            <ChevronRight size={17} />
          </button>
        )}
      </div>

        {/* NEW REVIEW */}
        <div className="shrink-0 px-3">
          <Link
            href="/home"
            className={`
              flex items-center gap-3 rounded-xl
              bg-emerald-500 px-4 py-3
              text-sm font-semibold text-white
              shadow-sm shadow-emerald-100
              transition
              hover:bg-emerald-600
              hover:shadow-md
              ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            <Plus size={19} />

            {!collapsed && <span>New Review</span>}
          </Link>
        </div>

        {/* NAVIGATION */}
        <div className="mt-7 shrink-0 px-3">
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Workspace
            </p>
          )}

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    group flex items-center gap-3 rounded-xl
                    px-3 py-3 text-sm font-medium
                    transition
                    ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.3 : 2}
                    className={
                      active
                        ? "text-emerald-600"
                        : "text-gray-400 group-hover:text-gray-700"
                    }
                  />

                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RECENT REVIEWS */}
        {!collapsed && (
          <div className="mt-7 min-h-0 flex-1 px-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Recent Reviews
              </p>

            <div className="space-y-1 overflow-y-auto">
              {recentReviews.map((review) => (
                <button
                  key={review}
                  type="button"
                  className="
                    w-full truncate rounded-xl
                    px-3 py-2.5
                    text-left text-sm text-gray-500
                    transition
                    hover:bg-gray-50
                    hover:text-gray-900
                  "
                >
                  {review}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM AREA */}
        <div className="relative mt-auto shrink-0 border-t border-gray-100 p-3">
          {/* PROFILE CARD */}
          <div
            ref={profileRef}
            className="relative"
            onMouseEnter={() => {
              setProfileOpen(true);
            }}
            onMouseLeave={() => {
              if (!profilePinned) {
                setProfileOpen(false);
              }
            }}
          >
            {showProfileMenu && !collapsed && (
              <div
                className="
                  absolute bottom-full left-0 mb-2 w-full
                  overflow-hidden rounded-2xl
                  border border-gray-200
                  bg-white
                  p-1.5
                  shadow-xl shadow-gray-200/50
                "
              >
                {/* PREMIUM */}
                <Link
                  href="/premium"
                  className="
                    flex items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm text-gray-700
                    transition hover:bg-amber-50
                  "
                >
                  <Crown
                    size={17}
                    className="text-amber-500"
                  />

                  <div className="flex-1">
                    <p className="font-medium">
                      Premium
                    </p>

                    <p className="text-[11px] text-gray-400">
                      Unlock more features
                    </p>
                  </div>
                </Link>

                {/* PROFILE */}
                <Link
                  href="/profile"
                  className="
                    flex items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm text-gray-700
                    transition hover:bg-gray-50
                  "
                >
                  <User size={17} />

                  <span>Profile</span>
                </Link>

                {/* LOGOUT */}
                <button
                  type="button"
                  className="
                    flex w-full items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm text-red-500
                    transition hover:bg-red-50
                  "
                >
                  <LogOut size={17} />

                  <span>Log out</span>
                </button>
              </div>
            )}

            {/* PROFILE TRIGGER */}
            <button
              type="button"
              onClick={() => {
                if (profilePinned) {
                  setProfilePinned(false);
                  setProfileOpen(false);
                } else {
                  setProfilePinned(true);
                  setProfileOpen(true);
                }
              }}
              className={`
                flex w-full items-center gap-3
                rounded-xl p-2
                transition
                hover:bg-gray-50
                ${collapsed ? "justify-center" : ""}
                ${
                  showProfileMenu
                    ? "bg-gray-50"
                    : ""
                }
              `}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                N
              </div>

              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      Nyon
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      Free plan
                    </p>
                  </div>

                  <ChevronRight
                    size={16}
                    className={`
                      text-gray-400
                      transition-transform
                      ${showProfileMenu ? "rotate-90" : ""}
                    `}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="min-w-0 flex-1">
        {children}
      </section>
    </main>
  );
}